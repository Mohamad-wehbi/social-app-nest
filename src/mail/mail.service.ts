import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendEmail(username:string, email:string, code: string) {
    //const url = `example.com/auth/confirm?token=${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset Password',
      template: './confirmation', 
      context: {username, code},
    });
  }
}
