import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

export interface Response<T> {
  data: T;
  status?: boolean;
  message?: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<Response<T>> {
    // console.log('context', context)
    return next.handle().pipe(
      map(({ data, status = true, message = 'success' }: Response<T>) => ({
        data: data || null,
        status: status,
        message: message,
      })),
    );
  }
}
