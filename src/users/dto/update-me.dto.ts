import { Status } from '@prisma/client';
import { IsString, MinLength, IsOptional } from 'class-validator';

export class UpdateMeDto {

    @IsOptional()
    @IsString()
    @MinLength(10)
    bio: string

    @IsOptional()
    @IsString()
    status: Status

    @IsOptional()
    @IsString()
    @MinLength(2)
    livesin: string

    @IsOptional()
    @IsString()
    @MinLength(2)
    worksAt: string
}