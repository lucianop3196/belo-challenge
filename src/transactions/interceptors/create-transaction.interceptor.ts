import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CreateTransactionResponse } from '../dtos/create-transaction.dto';
import { Transaction } from '../entities/transaction.entity';

@Injectable()
export class CreateTransactionInterceptor<T> implements NestInterceptor<T, CreateTransactionResponse> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<CreateTransactionResponse> {
    return next.handle().pipe(
      map((response: Transaction) => {
        return {
          data: { transactionId: response.id },
          success: true,
        };
      }),
    );
  }
}
