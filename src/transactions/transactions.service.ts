import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto, CreateTransactionResponse } from './dtos/create-transaction.dto';
import { DataSource, EntityManager, FindOneOptions, Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { AccountService } from 'src/account/account.service';
import { InjectRepository } from '@nestjs/typeorm';
import { EnumTransactionState } from './types/transaction-state.enum';
import Decimal from 'decimal.js';
import { GetTransactionsDto } from './dtos/get-transaction.dto';
import { NestedKeys } from 'src/types/nested-keys.type';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectRepository(Transaction)
        private readonly transactionRepository: Repository<Transaction>,
        private readonly accountService: AccountService,
        private readonly dataSource: DataSource,
    ) { }

    async findAll(transactionsDtoRequest: GetTransactionsDto) {
        const { userId, page, limit } = transactionsDtoRequest
        const transactionRelations: Array<NestedKeys<Transaction>> = ['originAccount.user', 'destinationAccount.user', 'originAccount', 'destinationAccount']

        return await this.transactionRepository.find({
            where: [
                { originAccount: { user: { id: +userId } } },
                { destinationAccount: { user: { id: +userId } } }
            ],
            take: limit,
            skip: (page - 1) * limit,
            relations: transactionRelations
        })
    }

    async findOneOrFail(option?: FindOneOptions<Transaction>): Promise<Transaction> {
        const tx = await this.transactionRepository.findOne(option)

        if (!tx) throw new NotFoundException(`No existe la transaccion transacción solicitada`)

        return tx
    }

    async create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
        const { originAddress, destinationAddress, amount } = createTransactionDto

        const [destinationAccount, originAccount] = await Promise.all([
            this.accountService.findOne(destinationAddress),
            this.accountService.findOne(originAddress),
        ]);

        const amountNumber = new Decimal(amount)

        if (amountNumber.lessThanOrEqualTo(0)) throw new BadRequestException('El monto debe ser mayor a 0')

        return await this.dataSource.transaction(async (entityManagerTransaction) => {
            const tx = Transaction.create(originAccount, destinationAccount, amount);

            const txCreated = await entityManagerTransaction.save(tx);

            if (amountNumber.lessThanOrEqualTo(50000)) {
                return await this.executeTransaction(txCreated.id, entityManagerTransaction)
            }

            return txCreated

        })
    }

    async executeTransaction(idTransaction: number, entityManagerTransaction?: EntityManager): Promise<Transaction> {

        if (!entityManagerTransaction) {
            return this.dataSource.transaction(async manager =>
                await this.executeTransaction(idTransaction, manager),
            );
        }

        const txRelations: Array<keyof Transaction> = ['originAccount', 'destinationAccount']

        const tx = await entityManagerTransaction.findOne(Transaction, { where: { id: idTransaction }, relations: txRelations })

        if (!tx) throw new BadRequestException(`No existe una transacción con id ${idTransaction}`)
        if (!tx.canExecute())
            throw new BadRequestException('No puedes ejecutar una transaccion con un estado distinto de Pendiente')

        await this.accountService.adjustBalance(tx.destinationAccount.address, tx.originAccount.address, tx.amount, entityManagerTransaction)

        tx.markAsConfirmed()

        return await entityManagerTransaction.save(Transaction, tx)
    }

    async approve(transactionId: number) {
        const tx = await this.findOneOrFail({ where: { id: transactionId } })

        if (!tx.canExecute()) throw new BadRequestException('No puedes ejecutar una transaccion con un estado distinto de Pendiente')

        return await this.executeTransaction(transactionId)
    }
}
