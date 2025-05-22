
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'transacciones' })
export class Transaction {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'origen' })
  origin: string;

  @Column({ name: 'destino' })
  destination: string;

  @Column({ name: 'monto' })
  amount: string;

  @Column({ name: 'estado' })
  state: boolean;

  @CreateDateColumn({ name: 'fecha_alta' })
  createdAt: Date

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  updatedAt: Date
}
