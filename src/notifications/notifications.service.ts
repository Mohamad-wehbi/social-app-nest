import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async getMyNotifications(id:number){
    const user = await this.prisma.user.findUnique({where:{id}, include:{notifications:true}});
    return { notifications: user.notifications}
  }

  async deleteNotification(id:number, notifId:number){
    const user = await this.prisma.user.update({where:{id}, data:{notifications:{delete:{id:notifId}}}, include:{notifications:true}});
    if(!user) throw new ForbiddenException("You are not allowed");
    return { message: "The notification has been deleted" }
  }

  async deleteAllNotifications(id:number){
    await this.prisma.user.update({where:{id}, data:{notifications:{deleteMany:{}}}});
    return { message: "All notifications have been deleted" }
  }
}
