
import { Account } from 'src/account/entities/account.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne } from 'typeorm';
import { EnumTransactionState } from '../types/transaction-state.enum';
import Decimal from 'decimal.js';
import { BadRequestException } from '@nestjs/common';

@Entity({ name: 'transacciones' })
export class Transaction {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ManyToOne(() => Account, { nullable: false })
  @JoinColumn({ name: 'origen' })
  originAccount: Account;

  @ManyToOne(() => Account, { nullable: false })
  @JoinColumn({ name: 'destino' })
  destinationAccount: Account;

  @Column({ name: 'monto', nullable: false })
  amount: string;

  @Column({ name: 'estado', default: EnumTransactionState.PENDING, enum: EnumTransactionState, enumName: 'transaction_state_enum' })
  state: EnumTransactionState;

  @CreateDateColumn({ name: 'fecha_alta' })
  createdAt: Date

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  updatedAt: Date

  canExecute(): boolean {
    return this.state === EnumTransactionState.PENDING;
  }

  markAsConfirmed() {
    this.state = EnumTransactionState.CONFIRMED;
  }

  markAsRejected() {
    this.state = EnumTransactionState.REJECTED;
  }

  static create(origin: Account, destination: Account, amount: string): Transaction {
    if (new Decimal(amount).lessThanOrEqualTo(0)) {
      throw new BadRequestException('El monto debe ser mayor a 0');
    }

    const transaction = new Transaction();
    transaction.originAccount = origin;
    transaction.destinationAccount = destination;
    transaction.amount = amount;
    transaction.state = EnumTransactionState.PENDING;

    return transaction;
  }
}
