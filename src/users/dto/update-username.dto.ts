import { IsString, MinLength, IsOptional } from 'class-validator';

export class UpdateUsernameDto {

    @IsOptional()
    @IsString()
    @MinLength(2)
    username: string

}