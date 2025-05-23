import { IsNumberString } from "class-validator";

export class ApproveTransactionDto {
    @IsNumberString()
    transactionId: number;
}