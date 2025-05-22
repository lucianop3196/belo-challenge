import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { EnumCurrency } from "../types/currency.enum";

@Entity({ name: 'monedas' })
export class Currency {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'enum', enum: EnumCurrency, enumName: 'moneda_codigo_enum' })
    code: number;

    @Column({ name: 'nombre' })
    name: number;
}