import { IsNumberString } from "class-validator";
import { CommonDto } from "src/dtos/common.dto";

export class GetTransactionsDto extends CommonDto {
    @IsNumberString()
    userId: string;
}