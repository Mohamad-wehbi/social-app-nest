import { ForbiddenException, Injectable } from '@nestjs/common';
import QueryBuilder from 'src/features/feature';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto, UpdateCommentDto } from './dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}
  private commentMessage(name:string){return `${name} commented on your post`}
  private selectUser(){return{user: {select: {id:true, username:true, profilePicUrl:true, email:true, livesin:true }}}}

  async getComments(query:any) {
    const mainComments = await this.prisma.comment.findMany();
    const {queryBuild, paginationResult} = new QueryBuilder(query, mainComments.length).search().select().sort().paginate();
    const comments = await this.prisma.comment.findMany({...queryBuild, include: this.selectUser()});
    return {comments, mainComments, paginationResult};
  }

  async commentsCount(){
    return await this.prisma.comment.count();
  }

  async createComment(id:number, data:CreateCommentDto){
    const content = {userId:id, postId:data.postId, desc:data.desc}
    const comment = await this.prisma.comment.create({data:content, include: {...this.selectUser(), post:{select:{userId:true}}}});
    
    if(comment.user.id !== comment.post.userId){
      const myData = {username: comment.user.username, userImg: comment.user.profilePicUrl, userId: id};
      await this.prisma.user.update({where:{id:comment.post.userId}, data:{
        notifications:{create:{...myData, message:this.commentMessage(myData.username)}}}});
    }
    return { comment, message:"Created successfully"}
  }

  async updateComment(id:number, commentId:number, data:UpdateCommentDto){
    let comment = await this.prisma.comment.findFirst({where:{id:commentId, userId:id}});
    if(!comment) throw new ForbiddenException("invalid request!");
    comment = await this.prisma.comment.update({where:{id: commentId}, data, include: this.selectUser()});
    return {comment, message:"Updated successfully"}
  }

  async deleteMyComment(id:number, commentId:number){
    let comment = await this.prisma.comment.findFirst({where:{id:commentId, userId:id}});
    if(!comment) throw new ForbiddenException("invalid request!");
    await this.prisma.comment.delete({where:{id: commentId}});
    return {message:"deleted successfully"}
  }

  async deleteComment(commentId:number){
    await this.prisma.comment.delete({where:{id: commentId}});
    return {message:"deleted successfully"}
  }
}
