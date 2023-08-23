import type { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { RedocModule, RedocOptions } from "@nicholas.braun/nestjs-redoc"
import * as fs from 'fs';

export const SWAGGER_DOCS_PATH = '/api/v1/docs/swagger';
export const REDOCLY_DOCS_PATH = '/api/v1/docs/redoc';

const swaggerDocsOptions = new DocumentBuilder()
  .setTitle('BJ LOCATIONS REST API')
  .setDescription('This is the documentation for the BJ LOCATIONS REST API')
  .setVersion('1.0')
  .addBearerAuth()
  .setContact("Metatronicx", "https://www.dev.metatronicx.com", "noreply@metatronicx.com")
  .build();

const redocliDocsOptions: RedocOptions = {
  title: 'BJ LOCATIONS REST API',
  sortPropsAlphabetically: true,
  hideDownloadButton: false,
  hideHostname: false
};

export const createApiDocumentation = async (app: any): Promise<INestApplication> => {
  const document = SwaggerModule.createDocument(app, swaggerDocsOptions)
  fs.writeFileSync("./openapi-schema.json", JSON.stringify(document));
  SwaggerModule.setup(SWAGGER_DOCS_PATH, app, document);
  await RedocModule.setup(REDOCLY_DOCS_PATH, app, document, redocliDocsOptions);
  return app;
}