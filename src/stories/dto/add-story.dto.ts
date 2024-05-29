import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class AddStoryDto {
    
    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    desc:string
}