import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { DeleteRolesDto } from './dto/delete-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly role: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.role.create(createRoleDto);
  }

  @Get()
  findAll() {
    return this.role.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.role.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.role.update(id, updateRoleDto);
  }

  @Delete('/batch')
  removeBatch(@Body() deleteRolesDto: DeleteRolesDto) {
    return this.role.removeBatch(deleteRolesDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.role.remove(id);
  }
}
