import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, ForbiddenException, HttpException, HttpStatus, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError, EntityNotFoundError, CannotCreateEntityIdMapError } from 'typeorm';
import { ValidationError } from 'class-validator';
import { ForbiddenError } from '@casl/ability';


@Catch()
export class AppExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();
        const request = context.getRequest<Request>();
        let message = (exception as any).message.message;
        let code = 'HttpException';

        Logger.error(message, (exception as any).stack, `${request.method} ${request.url}`);

        let status = HttpStatus.INTERNAL_SERVER_ERROR;

        switch (exception.constructor) {
            case HttpException:
                status = (exception as HttpException).getStatus();
                message = this.getErrorsMessages(exception);
                break;
            case UnauthorizedException:
                status = (exception as HttpException).getStatus();
                message = this.getErrorsMessages(exception);
                code = (exception as any).code;
                break;
            case BadRequestException:
                status = (exception as BadRequestException).getStatus();
                message = this.getErrorsMessages(exception);
                code = (exception as any).code;
                break;
            case ForbiddenException:
                status = (exception as ForbiddenException).getStatus();
                message = this.getErrorsMessages(exception);
                code = (exception as any).code;
                break;
            case NotFoundException:
                status = (exception as NotFoundException).getStatus();
                message = (exception as NotFoundException).message;
                code = (exception as any).code;
                break;
            case QueryFailedError:
                status = HttpStatus.UNPROCESSABLE_ENTITY
                message = (exception as QueryFailedError).message;
                code = (exception as any).code;
                break;
            case ForbiddenError:
                status = HttpStatus.FORBIDDEN
                message = (exception as ForbiddenException).message;
                code = (exception as any).code;
                break;
            case Error:
                if ((exception as any).code === "ENOENT") {
                    status = HttpStatus.NOT_FOUND
                    message = `Endpoint or file not found ${exception}`;
                    code = (exception as any).code;
                }
                break;
            case EntityNotFoundError:
                status = HttpStatus.UNPROCESSABLE_ENTITY
                message = (exception as EntityNotFoundError).message;
                code = (exception as any).code;
                break;
            case CannotCreateEntityIdMapError:
                status = HttpStatus.UNPROCESSABLE_ENTITY
                message = (exception as CannotCreateEntityIdMapError).message;
                code = (exception as any).code;
                break;
            default:
                status = HttpStatus.INTERNAL_SERVER_ERROR
                message = (exception as InternalServerErrorException).message;
                code = (exception as any).code;
                break;
        }
        response.status(status).json(GlobalResponseError(status, message, code, request, { short: true }));
    }

    getErrorsMessages(exception: any) {
        let exceptionResponse = (exception as BadRequestException).getResponse();
        let errorsObjects = (exceptionResponse as any).message
        if (errorsObjects instanceof Array && errorsObjects.some((error) => error instanceof ValidationError)) {
            let errorMessages: string[] = [];
            errorsObjects.forEach(
                (errorObject) => {
                    let constraints = errorObject.constraints;
                    Object.keys(constraints).forEach(
                        (key) => {
                            errorMessages.push(constraints[key]);
                        }
                    );
                }
            );
            return errorMessages;
        }
        return (exceptionResponse as any).message;
    }
}

export const GlobalResponseError: (
    statusCode: number,
    message: string,
    code: string,
    request: Request,
    options: { short: boolean }) => IResponseError = (
        statusCode: number,
        message: string,
        code: string,
        request: Request,
        options: { short: boolean }
    ): any => {
        return !options.short ? {
            statusCode: statusCode,
            message,
            code,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method
        } : message
    };

export interface IResponseError {
    statusCode: number;
    message: string | string[];
    code: string;
    timestamp: string;
    path: string;
    method: string;
}