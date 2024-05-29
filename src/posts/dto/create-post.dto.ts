import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreatePostDto {

    @IsNotEmpty()
    @IsString()
    @MinLength(10)
    desc: string

}