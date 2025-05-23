import { Body, Controller, Get, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { ApiSecurity } from '@nestjs/swagger';
import { GetTransactionsDto } from './dtos/get-transaction.dto';
import { CreateTransactionInterceptor } from './interceptors/create-transaction.interceptor';

@ApiSecurity('x-api-key')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) { }

  @UseInterceptors(CreateTransactionInterceptor)
  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    return await this.transactionsService.create(createTransactionDto);
  }

  @Get()
  async findAll(@Query() transactionsDtoRequest: GetTransactionsDto) {
    return await this.transactionsService.findAll(transactionsDtoRequest);
  }

  @UseInterceptors(CreateTransactionInterceptor)
  @Patch(':id/approve')
  async approve(@Param('id') transactionId: number) {
    return await this.transactionsService.approve(+transactionId);
  }

}
