import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { User } from 'src/auth/decorators/user.decorator';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@UseGuards(AuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationService: NotificationsService) {}

  @Get()
  getMyNotifications(@User("id") id:number){
    return this.notificationService.getMyNotifications(id);
  }

  @Delete()
  deleteAllNotifications(@User("id") id:number){
    return this.notificationService.deleteAllNotifications(id);
  }

  @Delete(":id")
  deleteNotification(@User("id") id:number, @Param("id") notifId:string){
    return this.notificationService.deleteNotification(id, +notifId);
  }
}
