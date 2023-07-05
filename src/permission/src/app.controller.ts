import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { CreateGroupDto } from './dto/create-group.dto';

@Controller()
export class AppController {
  constructor(private readonly app: AppService) {}

  @MessagePattern('create_permission')
  handleCreatePermission(createPermissionDto: CreatePermissionDto) {
    return this.app.createPermission(createPermissionDto);
  }

  @MessagePattern('get_permissions')
  handleGetPermissions() {
    return this.app.getPermissions();
  }

  @MessagePattern('get_permission')
  handleGetPermission(id: string) {
    return this.app.getPermission(id);
  }

  @MessagePattern('update_permission')
  handleUpdatePermission({
    id,
    updatePermissionDto,
  }: {
    id: string;
    updatePermissionDto: UpdatePermissionDto;
  }) {
    return this.app.updatePermission(id, updatePermissionDto);
  }

  @MessagePattern('delete_permission')
  handleDeletePermission(id: string) {
    return this.app.deletePermission(id);
  }

  @MessagePattern('delete_permissions')
  handleDeletePermissions(ids: string[]) {
    return this.app.deletePermissions(ids);
  }

  @MessagePattern('create_permission_group')
  handleCreateGroup(createGroupDto: CreateGroupDto) {
    return this.app.createGroup(createGroupDto);
  }

  @MessagePattern('get_permission_groups')
  handleGetGroups() {
    return this.app.getGroups();
  }

  @MessagePattern('get_permission_group')
  handleGetGroup(id: string) {
    return this.app.getGroup(id);
  }

  @MessagePattern('update_permission_group')
  handleUpdateGroup({
    id,
    updateGroupDto,
  }: {
    id: string;
    updateGroupDto: UpdateGroupDto;
  }) {
    return this.app.updateGroup(id, updateGroupDto);
  }

  @MessagePattern('delete_permission_group')
  handleDeleteGroup(id: string) {
    return this.app.deleteGroup(id);
  }

  @MessagePattern('delete_permission_groups')
  handleDeleteGroups(ids: string[]) {
    return this.app.deleteGroups(ids);
  }
}
