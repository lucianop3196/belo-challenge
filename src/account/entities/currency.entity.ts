import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { EnumCurrency } from "../types/currency.enum";

@Entity({ name: 'monedas' })
export class Currency {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'enum', enum: EnumCurrency, enumName: 'moneda_codigo_enum', nullable: false, unique: true })
    code: EnumCurrency;

    @Column({ name: 'nombre', nullable: true })
    name: number;
}