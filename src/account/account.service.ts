import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, FindOneOptions, Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import Decimal from 'decimal.js';

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(Account)
        private readonly accountRepository: Repository<Account>
    ) { }

    async findOne(address: string, options?: FindOneOptions<Account>): Promise<Account> {
        const account = await this.accountRepository.findOne({ where: { address } })

        if (!account) throw new NotFoundException(`La cuenta ${address} no existe`)

        return account
    }

    async adjustBalance(destinationAddress: string, originAddress: string, amount: string, entityManagerTransaction: EntityManager) {

        const [destinationAccount, originAccount] = await Promise.all([
            entityManagerTransaction.findOne(Account, { where: { address: destinationAddress }, lock: { mode: "pessimistic_write" } }),
            entityManagerTransaction.findOne(Account, { where: { address: originAddress }, lock: { mode: "pessimistic_write" } }),
        ]);

        const balanceDestinationAcc = new Decimal(destinationAccount.balance)

        const balanceOrigintionAcc = new Decimal(originAccount.balance)

        const amountNumber = new Decimal(amount)

        const newDestinationBalance = balanceDestinationAcc.plus(amountNumber)
        const newOriginBalance = balanceOrigintionAcc.minus(amountNumber)

        if (newOriginBalance.isNegative()) throw new BadRequestException(`La direccion ${originAddress} no tiene suficiente saldo`)

        await entityManagerTransaction.save(Account, [{ ...destinationAccount, balance: newDestinationBalance.toString() }, { ...originAccount, balance: newOriginBalance.toString() }])

        return { success: true }
    }
}
