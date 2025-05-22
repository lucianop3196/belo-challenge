
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'usuarios'})
export class User {
  @PrimaryGeneratedColumn({ name: 'id'})
  id: number;

  @Column({ name: 'nombre'})
  name: string;

  @Column({ name: 'email'})
  email: string;

  @Column({ name: 'saldo'})
  balance: string;
}
