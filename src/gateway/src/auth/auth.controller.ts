import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { User } from './entities/user.entity';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.auth.validateUser(loginDto);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { access_token, refresh_token } = await this.auth.generateToken(
      user as User,
    );

    return {
      user,
      access_token,
      refresh_token,
    };
  }

  @Public()
  @Post('refresh-token')
  refreshToken(refreshTokenDto: RefreshTokenDto) {
    // return this.auth.refreshToken(refreshTokenDto);
  }
}
