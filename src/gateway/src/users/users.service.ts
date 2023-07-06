import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUsersDto } from './dto/delete-user.dto';

@Injectable()
export class UsersService {
  constructor(@Inject('USER_SERVICE') private readonly user: ClientProxy) {}

  create(createUserDto: CreateUserDto) {
    // return this.user.send('create_user', new CreateUserEvent(createUserDto));
  }

  findAll() {
    return this.user.send('get_users', {});
  }

  findOne(id: string) {
    return this.user.send('get_user', id);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.user.send('update_user', {});
  }

  removeBatch(deleteUsersDto: DeleteUsersDto) {
    return this.user.send('delete_users', deleteUsersDto.ids);
  }

  remove(id: string) {
    return this.user.send('delete_user', id);
  }
}
