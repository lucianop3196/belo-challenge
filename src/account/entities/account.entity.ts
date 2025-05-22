import { User } from 'src/users/entities/user.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { AccountType } from './account-type.entity';
import { Currency } from './currency.entity';

@Entity({ name: 'cuentas' })
export class Account {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @ManyToOne(() => User, (user) => user.accounts, { nullable: false })
    @JoinColumn({ name: 'usuario_id' })
    user: User;

    @Column({ name: 'direccion', nullable: false, unique: true })
    address: string;

    @Column({ name: 'saldo', nullable: false, default: 0 })
    balance: string;

    @ManyToOne(() => AccountType, { nullable: false })
    @JoinColumn({ name: 'tipo_cuenta_id' })
    accountType: AccountType;

    @ManyToOne(() => Currency, { nullable: false })
    @JoinColumn({ name: 'moneda_id' })
    curency: Currency;
}
