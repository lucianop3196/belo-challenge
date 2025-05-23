import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionDto, CreateTransactionResponse } from './dtos/create-transaction.dto';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { AccountService } from 'src/account/account.service';
import { InjectRepository } from '@nestjs/typeorm';
import { EnumTransactionState } from './types/transaction-state.enum';
import Decimal from 'decimal.js';
import { GetTransactionsDto } from './dtos/get-transaction.dto';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectRepository(Transaction)
        private readonly transactionRepository: Repository<Transaction>,
        private readonly accountService: AccountService,
        private readonly dataSource: DataSource,
    ) { }

    async findAll(transactionsDtoRequest: GetTransactionsDto) {
        const { userId } = transactionsDtoRequest
        await this.transactionRepository.find({
            where: {
                originAccount: { user: { id: +userId } },
                destinationAccount: { user: { id: +userId } }
            }
        })

    }

    async create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
        const { originAddress, destinationAddress, amount } = createTransactionDto

        const [destinationAccount, originAccount] = await Promise.all([
            this.accountService.findOne(destinationAddress),
            this.accountService.findOne(originAddress),
        ]);

        const amountNumber = new Decimal(amount)

        if (amountNumber.lessThanOrEqualTo(0)) throw new BadRequestException('El monto debe ser mayor a 0')

        const tx = await this.dataSource.transaction(async (entityManagerTransaction) => {
            const tx = await entityManagerTransaction.save(Transaction, {
                destinationAccount,
                originAccount,
                amount,
                state: EnumTransactionState.PENDING
            })

            if (amountNumber.lessThanOrEqualTo(50000)) {
                await this.executeTranction(tx.id, entityManagerTransaction)
            }

            return tx
        })

        return tx
    }

    async executeTranction(idTransaction: number, entityManagerTransaction: EntityManager) {

        const txRelations: Array<keyof Transaction> = ['originAccount', 'destinationAccount']

        const tx = await entityManagerTransaction.findOne(Transaction, { where: { id: idTransaction }, relations: txRelations })

        if (!tx) throw new BadRequestException(`No existe una transacción con id ${idTransaction}`)
        if (tx.state === EnumTransactionState.CONFIRMED || tx.state === EnumTransactionState.REJECTED)
            throw new BadRequestException('No puedes ejecutar una transaccion con un estado distinto de Pendiente')

        await this.accountService.adjustBalance(tx.destinationAccount.address, tx.originAccount.address, tx.amount, entityManagerTransaction)

        await entityManagerTransaction.save(Transaction, { ...tx, state: EnumTransactionState.CONFIRMED })

        return { success: true }
    }
}
