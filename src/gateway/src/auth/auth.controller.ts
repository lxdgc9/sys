import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { lastValueFrom } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = this.auth.validateUser(loginDto);
    console.log('hello world:', user, lastValueFrom(user));
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { access_token, refresh_token } = await this.auth.generateToken(user);

    return {
      user,
      access_token,
      refresh_token,
    };
  }

  @Post('refresh-token')
  refreshToken(refreshTokenDto: RefreshTokenDto) {
    // return this.auth.refreshToken(refreshTokenDto);
  }
}
