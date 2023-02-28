import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception.status && !Number.isNaN(+exception.status)
        ? exception.status
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception?.message
      ? exception.message
      : exception.getMessage();

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message,
    };

    Logger.debug('AllExceptionFilter', exception);

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
