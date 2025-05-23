import { IsNumberString } from "class-validator";

export class CommonDto {

    @IsNumberString()
    page: number = 1

    @IsNumberString()
    limit: number = 10
}