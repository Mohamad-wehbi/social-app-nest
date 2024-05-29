import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ForgotPassword, SigninDto, SignupDto } from './dto';
import { VerifyResetCode } from './dto/verifyResetCode.dto';
import { ResetPassword } from './dto/resetPassword.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() data: SignupDto) {
    return this.authService.signup(data);
  }

  @HttpCode(200)
  @Post('signin')
  signin(@Body() data: SigninDto) {
    return this.authService.signin(data);
  }

  @HttpCode(200)
  @Post('forgotPassword')
  forgotPassword(@Body() data: ForgotPassword) {
    return this.authService.forgotPassword(data);
  }

  @HttpCode(200)
  @Post('verifyResetCode')
  verifyResetCode(@Body() data: VerifyResetCode) {
    return this.authService.verifyResetCode(data);
  }

  @HttpCode(200)
  @Post('resetPassword')
  resetPassword(@Body() data: ResetPassword) {
    return this.authService.resetPassword(data);
  }

}
