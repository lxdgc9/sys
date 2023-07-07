import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LoginEvent } from './events/login.event';
import { map } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(@Inject('USER_SERVICE') private readonly user: ClientProxy) {}

  login(loginDto: LoginDto) {
    const payload = this.user.send(
      'login',
      new LoginEvent(loginDto.k, loginDto.v, loginDto.password),
    );

    payload.pipe(
      map((v) => {
        console.log('test:', v);
      }),
    );

    return payload;
  }

  refreshToken(refreshTokenDto: RefreshTokenDto) {
    return 'refresh token...' + refreshTokenDto;
  }
}
