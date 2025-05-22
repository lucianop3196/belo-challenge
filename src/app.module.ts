import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyGuard } from './guards/api-key.guard';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }), UsersModule, DatabaseModule, TransactionsModule],
  controllers: [AppController],
  providers: [AppService,  { provide: APP_GUARD, useClass: ApiKeyGuard },],
})
export class AppModule { }
