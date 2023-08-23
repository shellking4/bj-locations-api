import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppExceptionFilter } from './commons/helpers/exception-filter.helper';
import { LoggingInterceptor } from './commons/helpers/logging-interceptor.helper';
import { AddressModule } from './location/address.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appOrmConfig } from './database/ormconfigs/app-orm-config';
import { AuthNGuard } from './user/guards/authn.guard';
import { AuthZGuard } from './user/guards/authz.guard';
import { BullModule } from '@nestjs/bull';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*'],
    }),
    TypeOrmModule.forRoot(appOrmConfig),
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
        }
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AddressModule,
  ],
  controllers: [AppController,],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthNGuard,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthZGuard,
    // },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    }
  ],
})
export class AppModule { }

