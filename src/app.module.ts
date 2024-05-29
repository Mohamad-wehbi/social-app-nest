import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { MailModule } from './mail/mail.module';
import { StoriesModule } from './stories/stories.module';
import { NotificationsModule } from './notifications/notifications.module';


@Module({
  imports: [
    AuthModule, 
    ConfigModule.forRoot({isGlobal:true}), 
    PrismaModule, 
    UsersModule, 
    CloudinaryModule, 
    PostsModule, 
    CommentsModule, 
    MailModule, 
    StoriesModule, 
    NotificationsModule]
})
export class AppModule {}
