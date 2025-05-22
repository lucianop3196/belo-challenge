import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { AccountType } from './entities/account-type.entity';
import { Currency } from './entities/currency.entity';
import { AccountService } from './account.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Account, AccountType, Currency]),
    ],
    providers: [AccountService],
    exports: [AccountService]
})
export class AccountModule { }
