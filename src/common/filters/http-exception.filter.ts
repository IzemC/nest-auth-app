import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponseDto } from '../dto/error-response.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody: any = exception.getResponse && exception.getResponse();
    const massage =
      (responseBody?.message
        ? Array.isArray(responseBody.message)
          ? responseBody.message.join(', ')
          : responseBody.message
        : exception.message) ?? 'Internal Server Error';
    const error = responseBody?.error ?? 'Unknown error';

    const errorResponse: ErrorResponseDto = {
      statusCode: status,
      message: massage,
      error: error,
    };

    console.error(`Error occurred on ${request.url}:`, errorResponse);

    response.status(status).json(errorResponse);
  }
}
