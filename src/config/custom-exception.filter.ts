import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BusinessException } from 'src/util/BusinessException';
import { ValidationError } from 'joi';
import { ValidationException } from 'src/util/ValidationException';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (
      exception instanceof BusinessException ||
      exception instanceof ValidationError ||
      exception instanceof BadRequestException ||
      exception instanceof ValidationException
    ) {
      response.status(400).send({
        path: request.url,
        code: !!exception ? exception['code'] || null : null,
        name: exception.name || 'unknownError',
        message: exception.message || 'unknownError',
        stack: exception.stack || 'unknownError',
      });
    } else {
      let status = HttpStatus.INTERNAL_SERVER_ERROR;
      if (exception instanceof HttpException) {
        status = exception.getStatus();
      }
      response.status(status).send({
        path: request.url,
        code: null,
        name:
          exception instanceof HttpException
            ? exception.name || 'unknownError'
            : 'unknownError',
        message:
          exception instanceof HttpException
            ? exception.getResponse
              ? exception.getResponse()['error']
              : 'unknownError'
            : 'unknownError',
        stack:
          exception instanceof HttpException
            ? exception.stack || 'unknownError'
            : 'unknownError',
      });
    }
  }
}
