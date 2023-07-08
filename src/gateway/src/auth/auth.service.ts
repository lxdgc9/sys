import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LoginEvent } from './events/login.event';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(@Inject('USER_SERVICE') private readonly user: ClientProxy) {}

  login(loginDto: LoginDto) {
    return this.user.send(
      'login',
      new LoginEvent(loginDto.k, loginDto.v, loginDto.password),
    );
  }

  refreshToken(refreshTokenDto: RefreshTokenDto) {
    return 'refresh token...' + refreshTokenDto;
  }
}
