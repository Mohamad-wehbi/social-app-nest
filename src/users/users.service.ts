import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateMeDto, UpdatePasswordDto, UpdateUsernameDto } from './dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import QueryBuilder from 'src/features/feature';
import * as argon from 'argon2';
import { UpdateEmailDto } from './dto/update-email.dto';


@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private cloudinary: CloudinaryService) {}

  private followingMessage(name:string){return `${name} started following you`}
  private visitMessage(name:string){return `${name} visited your profile`}

  private selectUser(){return{select: {id:true, username:true, profilePicUrl:true, email:true, livesin:true, followers:true }}}
  private populateUser(){return {include:{user:this.selectUser()}}}
  private populatePost(){return{include:{user:this.selectUser(),comments:this.populateUser(),likes:this.populateUser()}}}
  private populateAll(){return{include:{posts: this.populatePost(), following: true, followers:true}}};

  private filterProp(user:any){
    delete user.password;
    delete user.passResetCode;
    delete user.passResetExpires;
    delete user.passResetVerified;
    delete user.role;
    delete user.profilePicId;
    delete user.coverPicId;
    return user; 
  }


  async getUsers(query: any, id:number) {
    const mainUsers = await this.prisma.user.findMany();
    const {queryBuild, paginationResult} = new QueryBuilder(query, mainUsers.length).search().sort().select().paginate();
    const users = await this.prisma.user.findMany({...queryBuild, ...this.selectUser()});
    return {users, mainUsers, paginationResult};
  }
  
  async getUser(userId: number, id:number) {
    const user = await this.prisma.user.findUnique({where:{id:userId}, ...this.populateAll()});
    if(id != userId){
      const me = await this.prisma.user.findUnique({where:{id}});
      const myData = {username: me.username, userImg: me.profilePicUrl, userId: id};
      await this.prisma.user.update({where:{id:userId}, data:{
        notifications:{create:{...myData, message:this.visitMessage(myData.username)}}}})
    }
    return { user: this.filterProp(user) }  
  }

  async getFollowing(userId: number) {
    const user = await this.prisma.user.findUnique({where:{id:userId}, include:{following:true}});
    const followingIds = user.following.map(e=> e.userId);
    const following = await this.prisma.user.findMany({where:{id:{in: followingIds}}, include:{followers:true}})
    return { following: this.filterProp(following) }  
  }

  async getFollowers(userId: number) {
    const user = await this.prisma.user.findUnique({where:{id:userId}, include:{followers:true}});
    const followersIds = user.followers.map(e=> e.userId);
    const followers = await this.prisma.user.findMany({where:{id:{in: followersIds}}, include:{followers:true}})
    return { followers: this.filterProp(followers) }  
  }

  async countOfUsers(){ return await this.prisma.user.count() }
  deleteMe(id: number){ return this.deleteUser(id) }

  async deleteUser(id: number){
    const user = await this.prisma.user.delete({where:{id}, include: {posts: true}});
    if(user.profilePicId) await this.cloudinary.deleteImg(user.profilePicId);
    if(user.coverPicId) await this.cloudinary.deleteImg(user.coverPicId);
    if(user.posts.length) user.posts.map(async(post)=> await this.cloudinary.deleteImg(post.imageId));
    return { message: "Deleted successfully" };
  }

  async updateMe(id: number, data: UpdateMeDto){
    const user = await this.prisma.user.update({where:{id}, data });
    return { user: this.filterProp(user), message: "updated successfully" };
  }

  async updateEmail(id: number, data: UpdateEmailDto){
    const checkUser = await this.prisma.user.findUnique({where:{email:data.email}});
    if(checkUser) throw new ForbiddenException("There is really email!");
    const user = await this.prisma.user.update({where:{id}, data });
    return { email: user.email, message: "updated successfully" };
  }

  async updateUsername(id: number, data: UpdateUsernameDto){
    const user = await this.prisma.user.update({where:{id}, data });
    return { username: user.username, message: "updated successfully" };
  }

  async updatePassword(id: number, data: UpdatePasswordDto){
    let {password, newPassword, confirmNewPassword} = data;
    if(newPassword != confirmNewPassword)throw new BadRequestException("Invalid confirm password");
    let user = await this.prisma.user.findFirst({where:{id}});
    if(!user || !await argon.verify(user.password, password))throw new BadRequestException("Invalid password");
    newPassword = await argon.hash(newPassword);
    user = await this.prisma.user.update({where:{id}, data:{password:newPassword}});
    return { message: "The password has been updated" };
  }

  async changeProfilePic(id: number, file: Express.Multer.File){
    if(!file) throw new BadRequestException("Profile image is required!");
    let user = await this.prisma.user.findUnique({where:{id}});
    if(user.profilePicId) await this.cloudinary.deleteImg(user.profilePicId);
    const fileImg = await this.cloudinary.uploadFile(file);
    const {url: profilePicUrl, public_id: profilePicId} = fileImg
    user = await this.prisma.user.update({where:{id}, data:{profilePicUrl, profilePicId}});
    return { profilePicUrl: user.profilePicUrl, message: "The profile image has been updated" };
  }

  async changeCoverPic(id: number, file: Express.Multer.File){
    if(!file) throw new BadRequestException("Cover image is required!");
    let user = await this.prisma.user.findUnique({where:{id}});
    if(user.coverPicId) await this.cloudinary.deleteImg(user.coverPicId);
    const fileImg = await this.cloudinary.uploadFile(file);
    const {url: coverPicUrl, public_id: coverPicId} = fileImg
    user = await this.prisma.user.update({where:{id}, data:{coverPicUrl, coverPicId}});
    return { coverPicUrl: user.coverPicUrl, message: "The cover image has been updated" };
  }

  async deleteProfilePic(id: number){
    let user = await this.prisma.user.findUnique({where:{id}});
    if(!user.profilePicId)throw new BadRequestException("There is no profile image!");
    await this.cloudinary.deleteImg(user.profilePicId);
    user = await this.prisma.user.update({where:{id}, data: {
      profilePicUrl: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png",
      profilePicId: null }});
    return { profilePicUrl: user.profilePicUrl, message: "The profile image has been deleted" };  
  }

  async deleteCoverPic(id: number){
    let user = await this.prisma.user.findUnique({where:{id}});
    if(!user.coverPicId)throw new BadRequestException("There is no cover image!");
    await this.cloudinary.deleteImg(user.coverPicId);
    user = await this.prisma.user.update({where:{id}, data: {
      coverPicUrl: "https://flowbite.com/docs/images/examples/image-3@2x.jpg",
      coverPicId: null }});
    return { coverPicUrl: user.coverPicUrl, message: "The cover image has been deleted" };  
  }

  async followUser(id: number, userId: number){
    const user = await this.prisma.user.findUnique({where:{id: userId}, include:{followers:true}});
    const me = await this.prisma.user.findUnique({where:{id}, include:{following:true}});
    const follower = user.followers.find((el) => el.userId == id);
    const followed = me.following.find((el) => el.userId == userId);
    let newUser = null;
    let newMe = null;

    if(!follower && !followed && id != userId){
      newMe = await this.prisma.user.update({where:{id},data:{following:{create:[{userId}]}}, include:{following:true}});
      newUser = await this.prisma.user.update({where:{id: userId},data: {followers: {create: [{userId: id}]}}, include:{followers:true}});
      const myData = {username: me.username, userImg: me.profilePicUrl, userId: id};
      await this.prisma.user.update({where:{id:userId}, data:{notifications:{create:{...myData, message:this.followingMessage(me.username)}}}})

    }else{
      newUser = await this.prisma.user.update({where:{id: userId},data: {followers: {delete: {id:follower.id}}}, include:{followers:true}});
      newMe = await this.prisma.user.update({where:{id}, data: {following: {delete: {id: followed.id }}}, include:{following:true}});
    }
    return {newUser, newMe, message:`You ${!follower?"Followed":"UnFollowed"} ${user.username}`};
  }
}
