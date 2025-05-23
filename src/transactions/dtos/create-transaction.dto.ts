import { IsNumberString, IsString } from "class-validator";
import { EnumTransactionState } from "../types/transaction-state.enum";

export class CreateTransactionDto {
    @IsString()
    originAddress: string;

    @IsString()
    destinationAddress: string;

    @IsNumberString({}, { message: 'El monto debe ser un número en formato string' })
    amount: string;
}

export class CreateTransactionResponse {
    success: boolean;
    data: {
        transactionId: number;
        state: EnumTransactionState,
        amount: string,
    }
}