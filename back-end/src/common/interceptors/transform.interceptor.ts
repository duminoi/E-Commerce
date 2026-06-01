import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: any;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map(data => {
        if (data && data.data !== undefined) return data;
        if (data && data.items !== undefined && data.meta !== undefined) {
          return { success: true, data: { items: data.items }, meta: data.meta };
        }
        return { success: true, data };
      }),
    );
  }
}
