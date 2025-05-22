import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(Account)
        private readonly accountRepository: Repository<Account>
    ) { }

    async findOne(address: string) {
        const account = await this.accountRepository.findOne({ where: { address } })

        if (!account) throw new NotFoundException(`La cuenta ${address} no existe`)

        return account
    }
}
