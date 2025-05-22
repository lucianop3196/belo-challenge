
import { Account } from 'src/account/entities/account.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity({ name: 'usuarios' })
export class User {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'nombre' })
    name: string;

    @Column({ name: 'email' })
    email: string;

    @Column({ name: 'saldo' })
    balance: string;

    @OneToMany(() => Account, account => account.user)
    accounts: Account[]
}
