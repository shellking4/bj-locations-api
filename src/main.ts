import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  BadRequestException,
  RequestMethod,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import {
  createApiDocumentation,
  REDOCLY_DOCS_PATH,
  SWAGGER_DOCS_PATH,
} from './commons/helpers/api-docs.helper';
import * as basicAuth from 'express-basic-auth';
import 'dotenv/config';
import * as morgan from 'morgan';
import { join } from 'path';
import { appLogger } from './commons/helpers/app-logger.helper';

async function bootstrap() {

  const AdminJSTypeorm = await import("@adminjs/typeorm");
  const AdminJS = await import('adminjs');

  AdminJS.default.registerAdapter({
    Resource: AdminJSTypeorm.Resource,
    Database: AdminJSTypeorm.Database,
  })

  const appOptions = {
    cors: true,
    rawBody: true,
    bufferLogs: true,
    logger: appLogger,
  };
  require('events').EventEmitter.defaultMaxListeners = Number.MAX_VALUE;
  process.env.TZ = 'Africa/Porto-Novo';
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    appOptions,
  );
  const routesExcludedFromGlobalPrefix = [
    { path: '/', method: RequestMethod.GET },
    { path: '/payment-gate', method: RequestMethod.GET },
    { path: '/', method: RequestMethod.GET },
  ];
  app.setGlobalPrefix('api/v1', { exclude: routesExcludedFromGlobalPrefix });
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        console.log(errors);
        throw new BadRequestException(errors);
      },
      transform: true,
    }),
  );
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.use(morgan('tiny'));
  app.use(
    [
      SWAGGER_DOCS_PATH,
      REDOCLY_DOCS_PATH,
      `${SWAGGER_DOCS_PATH}-json`,
      `${REDOCLY_DOCS_PATH}-json`,
    ],
    basicAuth({
      challenge: true,
      users: {
        [process.env.OPEN_API_USERNAME]: process.env.OPEN_API_PASSWORD,
      },
    }),
  );
  app.setBaseViewsDir(join(__dirname, 'views'));
  app.setViewEngine('hbs');
  (await createApiDocumentation(app)).listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
