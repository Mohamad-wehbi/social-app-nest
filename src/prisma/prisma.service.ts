import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {

  async onModuleInit() {
    await this.$connect();
  }

  cleanDb() {
    return this.$transaction([
      this.user.deleteMany(),
      this.post.deleteMany(),
      this.comment.deleteMany(),
      this.followers.deleteMany(),
      this.following.deleteMany(),
      this.story.deleteMany(),
      this.like.deleteMany(),
    ]);
  }
}