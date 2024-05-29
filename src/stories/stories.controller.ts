import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from 'src/auth/decorators/user.decorator';
import { StoriesService } from './stories.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { AddStoryDto } from './dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@UseGuards(AuthGuard, RolesGuard)
@Controller('stories')
export class StoriesController {
  constructor(private storyService: StoriesService){}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  addStory(@User("id") id:number, @Body() data:AddStoryDto, @UploadedFile() file:Express.Multer.File){
    return this.storyService.addStory(id, data, file);
  }

  @Get("user-stories")
  getFollowingStories(@User("id") id:number){
    return this.storyService.getFollowingStories(id);
  }

  @Get()
  @Roles("ADMIN")
  getStories(@Query() query:any){
    return this.storyService.getStories(query);
  }

  @Get("count")
  @Roles("ADMIN")
  storiesCount(){
    return this.storyService.storiesCount();
  }

  @Delete("user-story/:id")
  deleteMyStory(@User("id") id:number, @Param("id") storyId:string){
    return this.storyService.deleteMyStory(id, +storyId);
  }

  @Delete(":id")
  @Roles("ADMIN")
  deleteStory(@Param("id") storyId:string){
    return this.storyService.deleteStory(+storyId);
  }
}
