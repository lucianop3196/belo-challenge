import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { AccountService } from 'src/account/account.service';
import { InjectRepository } from '@nestjs/typeorm';
import { EnumTransactionState } from './types/transaction-state.enum';
import Decimal from 'decimal.js';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectRepository(Transaction)
        private readonly transactionRepository: Repository<Transaction>,
        private readonly accountService: AccountService,
        private readonly dataSource: DataSource,
    ) { }

    async create(createTransactionDto: CreateTransactionDto) {
        const { originAddress, destinationAddress, amount } = createTransactionDto
        const destinationAccount = await this.accountService.findOne(destinationAddress)
        const originAccount = await this.accountService.findOne(originAddress)


        await this.dataSource.transaction(async (entityManagerTransaction) => {
            const tx = await entityManagerTransaction.save(Transaction, {
                destinationAccount,
                originAccount,
                amount,
                state: EnumTransactionState.PENDIENTE
            })

            const amountNumber = new Decimal(amount)

            if (amountNumber.lessThanOrEqualTo(50000)) {
                await this.executeTranction(tx.id, entityManagerTransaction)
            }
        })
    }

    async executeTranction(idTransaction: number, entityManagerTransaction: EntityManager) {

        const txRelations: Array<keyof Transaction> = ['originAccount', 'destinationAccount']

        const tx = await entityManagerTransaction.findOne(Transaction, { where: { id: idTransaction }, relations: txRelations })

        if (!tx) throw new BadRequestException(`No existe una transacción con id ${idTransaction}`)
        if (tx.state === EnumTransactionState.CONFIRMADA || tx.state === EnumTransactionState.RECHAZADA)
            throw new BadRequestException('No puedes ejecutar una transaccion con un estado distinto de Pendiente')

        await this.accountService.adjustBalance(tx.destinationAccount.address, tx.originAccount.address, tx.amount, entityManagerTransaction)
 
        await entityManagerTransaction.save(Transaction, { ...tx, state: EnumTransactionState.CONFIRMADA })

        return { success: true }
    }
}
