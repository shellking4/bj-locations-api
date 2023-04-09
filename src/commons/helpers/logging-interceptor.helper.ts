import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { generateUUID } from './utils.helper';
import { Reflector } from "@nestjs/core";
import { ACCESSIBLE } from '../decorators/accessible.decorator';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  constructor(
    private reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() === 'http') {
      return this.logHttpCall(context, next);
    }
  }

  private logHttpCall(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const userAgent = request.get('user-agent') || '';
    const { ip, method, path: url } = request;
    const correlationKey = generateUUID();
    const userId = request.user?.id;
    const userName = request.user?.email;

    this.logger.log(
      `[${correlationKey}] ${method} ${url} ${userId} ${userAgent} ${ip}: ${context.getClass().name} ${context.getHandler().name}`,
    );

    const now = Date.now();
    
    return next.handle().pipe(
      tap(async () => {
        const response = context.switchToHttp().getResponse();
        const { statusCode, data } = response;
        const contentLength = response.get('content-length');
        let logInfo = `[${correlationKey}] ${method} ${url} ${statusCode} ${contentLength}: ${Date.now() - now}ms`;
        this.logger.log(logInfo);
      }),
    );
  }
}