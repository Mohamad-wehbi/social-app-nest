import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class SigninDto {

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string

}