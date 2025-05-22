import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { EnumAccountType } from '../types/account-type.enum';

@Entity({ name: 'tipo_cuenta' })
export class AccountType {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ type: 'enum', enum: EnumAccountType, enumName: 'tipo_cuenta_enum', nullable: false })
    type: number;
}
