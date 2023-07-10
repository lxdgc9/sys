import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { LoginEvent } from './events/login.event';
import { User } from './entities/user.entity';

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

  async generateToken(user: User) {
    return {
      access_token: await this.jwt.signAsync(
        {
          id: user.id,
          role: user.role.name,
          permissions: [
            ...new Set(
              user.role.permissions
                .map((permission) => permission.code)
                .concat(
                  user.spec_permissions.map((permission) => permission.code),
                ),
            ),
          ],
        },
        {
          secret: process.env.ACCESS_TOKEN_SECRET,
          expiresIn: '5m',
        },
      ),
      refresh_token: await this.jwt.signAsync(
        {
          id: user.id,
        },
        {
          secret: process.env.REFRESH_TOKEN_SECRET,
          expiresIn: '1w',
        },
      ),
    };
  }
}
