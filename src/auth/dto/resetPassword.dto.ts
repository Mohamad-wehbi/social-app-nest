import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class ResetPassword {

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    newPassword: string

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    confirmNewPassword: string

}