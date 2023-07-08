import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    const user = this.auth.login(loginDto);
    if (!user) {
      throw new UnauthorizedException('Đăng nhập không hợp lệ');
    }

    return user;
  }

  @Post('refresh-token')
  refreshToken(refreshTokenDto: RefreshTokenDto) {
    return this.auth.refreshToken(refreshTokenDto);
  }
}
