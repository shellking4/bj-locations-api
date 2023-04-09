import { Type } from "class-transformer";
import { IsNotEmpty, IsNotIn, IsNumber, IsOptional, IsPositive } from "class-validator";

export class PaginateDto {

    @IsNotEmpty({ message: "You cannot leave the field $property blank" })
    @IsPositive()
    @IsNotIn([0])
    @Type(() => Number)
    @IsNumber({}, { message: "The field $property needs to be a number" })
    pageNumber: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: "The field $property needs to be a number" })
    @IsPositive()
    @IsNotIn([0])
    dataLength?: number;

}