import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';
import QueryBuilder from 'src/features/feature';
import { AddStoryDto } from './dto';

@Injectable()
export class StoriesService {
  constructor(private prisma: PrismaService, private cloudinary: CloudinaryService) {}

  private selectUser(){return {select: {id:true, username:true, profilePicUrl:true, livesin:true, email:true }}}
  private populateUser(){return {include:{user:this.selectUser()}}}

  async addStory(id:number, data:AddStoryDto, file: Express.Multer.File){
    if(!file) throw new BadRequestException("The image is required!");
    const {url: image, public_id: imageId} = await this.cloudinary.uploadFile(file);
    const story = await this.prisma.story.create({data:{userId:id, image, imageId, ...data}, ...this.populateUser()});
    return {story, message: "The story has been added successfully"}
  }

  async storiesCount() {
    return await this.prisma.story.count();
  }

  async deleteMyStory(id:number, storyId:number){
    const story = await this.prisma.story.findFirst({where:{id:storyId, userId:id}});
    if(!story) throw new ForbiddenException("invalid request");
    await this.cloudinary.deleteImg(story.imageId);
    await this.prisma.story.delete({where:{id:storyId}});
    return {message: "The story has been deleted successfully"}
  }

  async cleanStories(){
    const lastDay = Date.now() - (24 * 60 * 60 * 1000); // 1d
    let stories = await this.prisma.story.findMany({where:{ createdAt:{lte: new Date(lastDay)}}});
    const imagesIds = stories.map((story)=> story.imageId);
    imagesIds.forEach(async(imageId)=> await this.cloudinary.deleteImg(imageId))
    await this.prisma.story.deleteMany({where:{createdAt:{lte: new Date(lastDay)}}});
  }

  async getFollowingStories(id:number){
    this.cleanStories();
    const followersStories = await this.prisma.story.findMany({
      where:{OR:[{user:{followers:{some:{userId: id}}}},{userId:id}]}, ...this.populateUser()});
    const getUsersIds = followersStories.map((story)=> story.userId);
    const usersIds = [...new Set(getUsersIds)];
    const stories = usersIds.map((userId)=> followersStories.filter((ele)=> userId == ele.userId));
    return { stories, usersIds};
  }

  async getStories(query:any){
    this.cleanStories();
    const mainStories = await this.prisma.story.findMany();
    const {queryBuild, paginationResult} = new QueryBuilder(query, mainStories.length).search().sort().select().paginate();
    const stories = await this.prisma.story.findMany({...queryBuild, ...this.populateUser()});
    return { stories, mainStories, paginationResult };
  }

  async deleteStory(storyId:number){
    const story = await this.prisma.story.findFirst({where:{id:storyId}});
    if(!story) throw new ForbiddenException("There is no story");
    await this.cloudinary.deleteImg(story.imageId);
    await this.prisma.story.delete({where:{id:storyId}});
    return {message: "The story has been deleted successfully"}
  }

}
