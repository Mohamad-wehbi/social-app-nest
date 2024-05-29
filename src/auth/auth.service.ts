import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ForgotPassword, SigninDto, SignupDto } from './dto';
import { createHash } from 'crypto';
import { MailService } from 'src/mail/mail.service';
import { VerifyResetCode } from './dto/verifyResetCode.dto';
import { ResetPassword } from './dto/resetPassword.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService, 
    private jwt: JwtService, 
    private mail: MailService, 
    private config: ConfigService) {}

  private createToken(id: number, role: string){
    const secret = this.config.get("SECRET_KEY_JWT")
    return this.jwt.signAsync({id, role},{ secret })
  }

  private hashedResetCode(resetCode){
    return createHash("sha256").update(resetCode).digest("hex");
  }

  private selectUser(){return {select: {id:true, username:true, profilePicUrl:true, role:true, password:true }}}


  async signup(data: SignupDto) {
    const { email } = data;
    const isUser = await this.prisma.user.findUnique({ where: { email } });
    if (isUser)throw new ForbiddenException('Email already registered!');
    data.password = await argon.hash(data.password);
    const user = await this.prisma.user.create({data, ...this.selectUser()})
    const token = await this.createToken(user.id, user.role);
    delete user.password;
    return {user, token, message:`Hello ${user.username} we are happy to have you join our Application`}
  }

  async signin(data: SigninDto){
    const {email, password} = data
    const user = await this.prisma.user.findUnique({where:{email}, ...this.selectUser()});
    if(!user || !await argon.verify(user.password, password))
    throw new ForbiddenException("invalid email or password");
    const token = await this.createToken(user.id, user.role);
    delete user.password;
    return {user, token, message:`Welcome Back ${user.username}!`};
  }

  async forgotPassword(data:ForgotPassword){
    const {email} = data;
    console.log(new Date())
    const user = await this.prisma.user.findFirst({where:{email}})
    if(!user) throw new NotFoundException("there is no user for this email");
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(new Date())
    await this.mail.sendEmail(user.username, user.email, resetCode);
    const time = Date.now() + (1 * 60 * 1000); // 1m

    await this.prisma.user.update({where:{id:user.id}, data: {
      passResetCode : +this.hashedResetCode(resetCode),
      expiresTime : new Date(time), // 1d
      passResetVerified : false
    }})
    return { message: "reset code sent to email" };
  }

  async verifyResetCode(data:VerifyResetCode){
    const {resetCode} = data;
    const user = await this.prisma.user.findFirst({where:{
      passResetCode: +this.hashedResetCode(resetCode),
      expiresTime: {gt :new Date()},

    }})
    if(!user) throw new BadRequestException("Reset code invalid or expired");
    await this.prisma.user.update({where:{id:user.id}, data:{passResetVerified: true}});
    return { message: "The reset code is valid" };
  }

  async resetPassword(data:ResetPassword){
    let {email, newPassword, confirmNewPassword} = data;
    if(newPassword != confirmNewPassword)throw new BadRequestException("invalid confirm new password ");
    const user = await this.prisma.user.findFirst({where:{email, passResetVerified: true}})
    if(!user) throw new ForbiddenException("You are not allowed to reset password");
    newPassword = await argon.hash(newPassword);
    await this.prisma.user.update({where:{id: user.id}, data:{
      password: newPassword,
      passResetCode: undefined,
      expiresTime: undefined,
      passResetVerified: undefined
    }})
    return {message: "The password has been updated successfully"};
  }
}
