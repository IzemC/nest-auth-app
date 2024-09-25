import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const startTime = Date.now();

    this.logger.log(`Incoming Request: ${method} ${url}`);

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - startTime;
        this.logger.log(
          `Outgoing Response: ${method} ${url} - ${responseTime}ms`,
        );
      }),
      catchError((err) => {
        const responseTime = Date.now() - startTime;
        this.logger.error(
          `Error Response: ${method} ${url} - ${responseTime}ms - Error: ${err.message}`,
        );
        throw err;
      }),
    );
  }
}
