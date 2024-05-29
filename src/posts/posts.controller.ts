import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { User } from 'src/auth/decorators/user.decorator';
import { CreatePostDto, UpdatePostDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';


@UseGuards(AuthGuard, RolesGuard)
@Controller('posts')
export class PostsController {
  constructor(private postService: PostsService) {}

  
  @Get()
  @Roles("ADMIN")
  getPosts(@Query() query:any){
    return this.postService.getPosts(query);
  }

  @Get("user-posts")
  getFollowingPosts(@User("id") id:number){
    return this.postService.getFollowingPosts(id);
  }

  @Get("count")
  @Roles("ADMIN")
  postsCount(){
    return this.postService.postsCount();
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  createPost(@User("id") id:number, @Body() data:CreatePostDto, @UploadedFile() file:Express.Multer.File){
    return this.postService.createPost(id, data, file);
  }

  @Delete("delete-user-post/:id")
  deleteMyPost(@User("id") id:number, @Param("id") postId:string){
    return this.postService.deleteMyPost(id, +postId);
  }

  @Patch("update-post/:id")
  @UseInterceptors(FileInterceptor('image'))
  updatePost(@User("id") id:number, @Param("id") postId:string, @UploadedFile() file:Express.Multer.File, @Body() data:UpdatePostDto){
    return this.postService.updatePost(id, +postId, file, data);
  }

  @Get("post-like/:id")
  addlike(@User("id") id:number, @Param("id") postId:string){
    return this.postService.addlike(id, +postId);
  }

  @Delete("id")
  @Roles("ADMIN")
  deletePost(@Param() postId:string){
    return this.postService.deletePost(+postId);
  }
}
