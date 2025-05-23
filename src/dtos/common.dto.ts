import { IsNumberString } from "class-validator";

export class CommonDto {

    @IsNumberString()
    page: string = "1"

    @IsNumberString()
    limit: string = "10"
}