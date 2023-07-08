import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoginDto } from './dto/login.dto';
import { LoginEvent } from './events/login.event';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    @Inject('USER_SERVICE') private readonly user: ClientProxy,
  ) {}

  validateUser(loginDto: LoginDto) {
    const user = this.user.send(
      'login',
      new LoginEvent(loginDto.k, loginDto.v, loginDto.password),
    );

    return user;
  }

  async generateToken(user: any) {
    let refreshToken;

    return {
      access_token: await this.jwt.signAsync(user.id, {
        secret: 'hello world',
      }),
      refresh_token: refreshToken,
    };
  }
}
