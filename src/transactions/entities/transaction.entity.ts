
import { Account } from 'src/account/entities/account.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne } from 'typeorm';
import { EnumTransactionState } from '../types/transaction-state.enum';

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

  @Column({ name: 'estado', default: EnumTransactionState.PENDIENTE, enum: EnumTransactionState, enumName: 'transaction_state_enum' })
  state: EnumTransactionState;

  @CreateDateColumn({ name: 'fecha_alta' })
  createdAt: Date

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  updatedAt: Date
}
