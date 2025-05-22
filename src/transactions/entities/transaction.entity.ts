
import { Account } from 'src/account/entities/account.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'transacciones' })
export class Transaction {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'origen' })
  originAccount: Account;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'destino' })
  destinationAccount: Account;

  @Column({ name: 'monto' })
  amount: string;

  @Column({ name: 'estado' })
  state: boolean;

  @CreateDateColumn({ name: 'fecha_alta' })
  createdAt: Date

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  updatedAt: Date
}
