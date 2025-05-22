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

    @ManyToOne(() => User, (user) => user.accounts)
    @JoinColumn({ name: 'usuario_id' })
    user: User;

    @Column({ name: 'direccion' })
    address: string;

    @Column({ name: 'saldo' })
    balance: string;

    @ManyToOne(() => AccountType)
    @JoinColumn({ name: 'tipo_cuenta_id' })
    accountType: AccountType;

    @ManyToOne(() => Currency)
    @JoinColumn({ name: 'moneda_id' })
    curency: Currency;
}
