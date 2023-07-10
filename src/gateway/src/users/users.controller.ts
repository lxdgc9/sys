import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUsersDto } from './dto/delete-user.dto';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/permission.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly user: UsersService) {}

  @Permissions(Permission.CreateUser)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.user.create(createUserDto);
  }

  @Permissions(Permission.GetUser)
  @Get()
  findAll() {
    return this.user.findAll();
  }

  @Permissions(Permission.GetUser)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.user.findOne(id);
  }

  @Permissions(Permission.UpdateUser)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.user.update(id, updateUserDto);
  }

  @Permissions(Permission.DeleteUser)
  @Delete('/batch')
  removeBatch(@Body() deleteUsersDto: DeleteUsersDto) {
    return this.user.removeBatch(deleteUsersDto);
  }

  @Permissions(Permission.DeleteUser)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.user.remove(id);
  }
}
