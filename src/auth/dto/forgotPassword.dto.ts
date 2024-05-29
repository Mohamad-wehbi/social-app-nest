import { IsNotEmpty, IsEmail } from 'class-validator';

export class ForgotPassword {

    @IsEmail()
    @IsNotEmpty()
    email: string

}