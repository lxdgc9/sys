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

@Controller('users')
export class UsersController {
  constructor(private readonly user: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.user.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.user.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.user.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.user.update(id, updateUserDto);
  }

  @Delete('/batch')
  removeBatch(@Body() deleteUsersDto: DeleteUsersDto) {
    return this.user.removeBatch(deleteUsersDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.user.remove(id);
  }
}
