import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { map } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const loginPayload = this.auth.login(loginDto);

    let user: any;
    await new Promise<void>((resolve, reject) => {
      loginPayload.subscribe({
        next: (v) => {
          user = v;
        },
        error: (err) => {
          reject(err);
        },
        complete: () => {
          resolve();
        },
      });
    });

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
