import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import QueryBuilder from 'src/features/feature';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto, UpdatePostDto } from './dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService, private cloudinary: CloudinaryService) {}

  private likeMessage(name:string){return `${name} liked your post`};

  private selectUser(){return {select: {id:true, username:true, profilePicUrl:true, email:true, livesin:true, followers:true }}}
  private populateUser(){return {include:{user:this.selectUser()}}}
  private populateAll(){
    return{
      include:{
        comments: this.populateUser(),
        user: this.selectUser(),
        likes: this.populateUser()
      }}}
  
  async getPosts(query: any) {
    const mainPosts = await this.prisma.post.findMany();
    const {queryBuild, paginationResult} = new QueryBuilder(query, mainPosts.length).search().sort().select().paginate();
    const posts = await this.prisma.post.findMany({...queryBuild, ...this.populateAll()});
    return { posts, mainPosts, paginationResult};
  }

  async getFollowingPosts(id:number) {
    const posts = await this.prisma.post.findMany({
      where:{OR:[{user:{followers:{some:{userId:id}}}},{userId:id}]}, ...this.populateAll()});  
    return {posts};
  }

  async createPost(id: number, data: CreatePostDto, file: Express.Multer.File){
    if(!file) throw new BadRequestException("The image is required!");
    const {url: image, public_id: imageId} = await this.cloudinary.uploadFile(file);
    const post = await this.prisma.post.create({ data: {userId: id, desc: data.desc, image, imageId}, ...this.populateAll()});
    return { post, message: "The post has been created" };
  }

  async updatePost(id: number, postId: number, file: Express.Multer.File, data: UpdatePostDto){
    let post = await this.prisma.post.findFirst({where:{id: postId, userId: id}})
    if(!post) throw new ForbiddenException("invalid request!");
    const newData:any = {};
    newData.desc = data.desc;

    if(file){
      await this.cloudinary.deleteImg(post.imageId)
      const {url: image, public_id: imageId} = await this.cloudinary.uploadFile(file)
      newData.image = image;
      newData.imageId = imageId;
    }

    post = await this.prisma.post.update({where:{id: postId}, data: newData, ...this.populateAll()});
    return { post, message: "The post has been updated" };
  }

  async deleteMyPost(id: number, postId: number){
    const post = await this.prisma.post.findFirst({where:{id: postId, userId: id}})
    if(!post) throw new ForbiddenException("invalid request!");

    await this.cloudinary.deleteImg(post.imageId)
    await this.prisma.post.delete({where:{id:postId}});
    return { message: "The post has been deleted" };
  }

  async deletePost(postId: number){
    const post = await this.prisma.post.delete({where:{id: postId}});
    await this.cloudinary.deleteImg(post.imageId)
    return { message: "The post has been deleted" };
  }

  async postsCount() {
    return await this.prisma.post.count();
  }

  async addlike(id:number, postId:number) {
    const like = await this.prisma.like.findFirst({where: {userId: id, postId}})
    if(like) await this.prisma.like.delete({where: {id: like.id}})
    else {
      const like = await this.prisma.like.create({data: {userId: id, postId}, include:{user:true, post:true}})

      if(like.user.id !== like.post.userId){
        const myData = {username: like.user.username, userImg: like.user.profilePicUrl, userId: id};
        await this.prisma.user.update({where:{id:like.post.userId}, data:{
          notifications:{create:{...myData, message:this.likeMessage(myData.username)}}}})
      }}
    const post = await this.prisma.post.findFirst({where:{id: postId}, include:{likes: this.populateUser()}});
    return { post, message: `${!like ? "like" : "Unlike"} successfully` };
  }
}
