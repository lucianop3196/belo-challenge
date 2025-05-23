import { Body, Controller, Post } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { ApiSecurity } from '@nestjs/swagger';

@ApiSecurity('x-api-key')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }
}
