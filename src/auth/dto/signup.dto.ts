import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class SignupDto {

    @IsString()
    @IsNotEmpty()
    username: string

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string

}