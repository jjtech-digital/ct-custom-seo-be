import { IsNotEmpty, IsString } from "class-validator";

export class QueryMetaDataDto {
    @IsString()
    @IsNotEmpty()
    query: string;

}