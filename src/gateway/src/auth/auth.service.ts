import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { lastValueFrom } from 'rxjs';
import { LoginDto } from './dto/login.dto';
import { LoginEvent } from './events/login.event';
import { User } from './entities/user.entity';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    @Inject('USER_SERVICE') private readonly user: ClientProxy,
    private readonly ws: EventsGateway,
  ) {}

  async validateUser(loginDto: LoginDto) {
    const observUser = this.user.send(
      'login',
      new LoginEvent(loginDto.k, loginDto.v, loginDto.password),
    );
    const user: User = await lastValueFrom(observUser);

    return user;
  }

  async validateUserFromToken(token: string) {
    type RefreshTokenJwtPayload = {
      id: string;
    };

    try {
      const payload: RefreshTokenJwtPayload = await this.jwt.verifyAsync(
        token,
        {
          secret: process.env.REFRESH_TOKEN_SECRET,
        },
      );

      const observUser = this.user.send('get_user', payload.id);
      const user = await lastValueFrom(observUser);

      return user;
    } catch (err) {
      console.log(err);
    }

    return null;
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
          is_active: user.is_active,
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
