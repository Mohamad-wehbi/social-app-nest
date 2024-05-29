import { IsString, Length } from "class-validator";

export class UpdateCommentDto {
    
    @IsString()
    @Length(10)
    desc:string
}