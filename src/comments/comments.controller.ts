import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { User } from 'src/auth/decorators/user.decorator';
import { CreateCommentDto, UpdateCommentDto } from './dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@UseGuards(AuthGuard, RolesGuard)
@Controller('comments')
export class CommentsController {
  constructor(private commentService: CommentsService) {}

  @Roles("ADMIN")
  @Get()
  getComments(@Query() query:any){
    return this.commentService.getComments(query);
  }

  @Post()
  createComment(@User("id") id:number, @Body() data:CreateCommentDto){
    return this.commentService.createComment(id, data);
  }

  @Roles("ADMIN")
  @Get("count")
  commentsCount(){
    return this.commentService.commentsCount();
  }

  @Patch(":id")
  updateComment(@User("id") id:number,@Param("id") commentId:string, @Body() data:UpdateCommentDto){
    return this.commentService.updateComment(id, +commentId, data);
  }

  @Delete("delete-comment-user/:id")
  deleteMyComment(@User("id") id:number,@Param("id") commentId:string){
    return this.commentService.deleteMyComment(id, +commentId);
  }
  
  @Roles("ADMIN")
  @Delete("delete-comment-admin/:id")
  deleteComment(@Param("id") commentId:string){
    return this.commentService.deleteComment(+commentId);
  }
}
