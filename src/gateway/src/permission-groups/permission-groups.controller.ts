import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PermissionGroupsService } from './permission-groups.service';
import { CreatePermissionGroupDto } from './dto/create-permission-group.dto';
import { UpdatePermissionGroupDto } from './dto/update-permission-group.dto';
import { DeletePermissionGroupsDto } from './dto/delete-permission-group.dto';

@Controller('permission-groups')
export class PermissionGroupsController {
  constructor(private readonly permissionGroup: PermissionGroupsService) {}

  @Post()
  create(@Body() createPermissionGroupDto: CreatePermissionGroupDto) {
    return this.permissionGroup.create(createPermissionGroupDto);
  }

  @Get()
  findAll() {
    return this.permissionGroup.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionGroup.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePermissionGroupDto: UpdatePermissionGroupDto,
  ) {
    return this.permissionGroup.update(id, updatePermissionGroupDto);
  }

  @Delete('/batch')
  removeBatch(@Body() deletePermissionGroupsDto: DeletePermissionGroupsDto) {
    return this.permissionGroup.removeBatch(deletePermissionGroupsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionGroup.remove(id);
  }
}
