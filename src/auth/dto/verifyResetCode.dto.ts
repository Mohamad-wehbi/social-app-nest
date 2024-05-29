import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyResetCode {

    @IsString()
    @IsNotEmpty()
    resetCode: string

}