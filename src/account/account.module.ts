import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { AccountType } from './entities/account-type.entity';
import { Currency } from './entities/currency.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Account, AccountType, Currency]),
    ],
})
export class AccountModule { }
