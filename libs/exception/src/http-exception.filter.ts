import {
  ArgumentsHost,
  Catch,
  HttpException,
  ExceptionFilter,
} from '@nestjs/common';
import { Request, Response } from 'express';
@Catch(HttpException)
export class HTTPExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const responseException = exception.getResponse();
    console.log('responseException', responseException);

    let responseFilter = {
      statusCode: status,
      message: exception.message,
      path: request.url,
      cause: exception.cause?.message,
      timestamp: new Date().toISOString(),
    };
    if (typeof responseException === 'object') {
      responseFilter = { ...responseFilter, ...responseException };
    }

    response.status(status).json(responseFilter);
  }
}
