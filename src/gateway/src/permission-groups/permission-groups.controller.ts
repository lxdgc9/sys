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
import { DeletePermissionGroupsDto } from './dto/delete-permission-group-batch.dto';

@Controller('permission-groups')
export class PermissionGroupsController {
  constructor(
    private readonly permissionGroupService: PermissionGroupsService,
  ) {}

  @Post()
  create(@Body() createPermissionGroupDto: CreatePermissionGroupDto) {
    return this.permissionGroupService.create(createPermissionGroupDto);
  }

  @Get()
  findAll() {
    return this.permissionGroupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionGroupService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePermissionGroupDto: UpdatePermissionGroupDto,
  ) {
    return this.permissionGroupService.update(id, updatePermissionGroupDto);
  }

  @Delete('/batch')
  removeBatch(@Body() deletePermissionGroupsDto: DeletePermissionGroupsDto) {
    return this.permissionGroupService.removeBatch(deletePermissionGroupsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionGroupService.remove(id);
  }
}
