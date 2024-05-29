import { Controller, UploadedFile, UseInterceptors, Get, Query, Param, Delete, UseGuards, Body, Patch } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { User } from 'src/auth/decorators/user.decorator';
import { UpdateMeDto, UpdatePasswordDto, UpdateUsernameDto } from './dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { UpdateEmailDto } from './dto/update-email.dto';

@UseGuards(AuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService){}

  @Get()
  getUsers(@Query() query: any, @User("id") id: number){
    return this.userService.getUsers(query, id);
  }

  @Patch("update-me")
  updateMe(@User("id") id: number, @Body() data: UpdateMeDto){
    return this.userService.updateMe(id, data);
  }

  @Patch("update-email")
  updateEmail(@User("id") id: number, @Body() data: UpdateEmailDto){
    return this.userService.updateEmail(id, data);
  }

  @Patch("update-username")
  updateUsername(@User("id") id: number, @Body() data: UpdateUsernameDto){
    return this.userService.updateUsername(id, data);
  }

  @Delete("delete-me")
  deleteMe(@User("id") id: number){
    return this.userService.deleteMe(id);
  }

  @Patch("update-password")
  updatePassword(@User("id") id: number, @Body() data: UpdatePasswordDto){
    return this.userService.updatePassword(id, data);
  }

  @Patch("change-profile-img")
  @UseInterceptors(FileInterceptor('profileImg'))
  changeProfilePic(@User("id") id: number, @UploadedFile() file: Express.Multer.File){
    return this.userService.changeProfilePic(id, file);
  }

  @Patch("change-cover-img")
  @UseInterceptors(FileInterceptor('coverImg'))
  changeCoverPic(@User("id") id: number, @UploadedFile() file: Express.Multer.File){
    return this.userService.changeCoverPic(id, file);
  }

  @Delete("delete-profile-img")
  deleteProfilePic(@User("id") id: number){
    return this.userService.deleteProfilePic(id);
  }

  @Delete("delete-cover-img")
  deleteCoverPic(@User("id") id: number){
    return this.userService.deleteCoverPic(id);
  }
  @Roles("ADMIN")
  @Get("count")
  countOfUsers(){
    return this.userService.countOfUsers();
  }

  @Get(":id")
  getUser(@Param("id") userId:string, @User("id") id:number){
    return this.userService.getUser(+userId, id);
  }

  @Roles("ADMIN")
  @Delete(":id")
  deleteUser(@Param("id") id: string){
    return this.userService.deleteUser(+id);
  }

  @Get("follow/:id")
  followUser(@User("id") id: number, @Param("id") userId: string){
    return this.userService.followUser(id, +userId);
  }

  @Get("following/:id")
  getFollowing(@Param("id") userId:string){
    return this.userService.getFollowing(+userId);
  }

  @Get("followers/:id")
  getFollowers(@Param("id") userId:string){
    return this.userService.getFollowers(+userId);
  }
}
