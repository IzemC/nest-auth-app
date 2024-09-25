import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponseDto } from '../dto/error-response.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse: ErrorResponseDto = {
      statusCode: status,
      message: exception.message || 'Internal Server Error',
      error: exception.getResponse
        ? (exception.getResponse() as any).error
        : 'Unknown error',
    };

    console.error(`Error occurred on ${request.url}:`, errorResponse);

    response.status(status).json(errorResponse);
  }
}
