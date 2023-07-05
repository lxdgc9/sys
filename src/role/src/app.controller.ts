import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { PermissionCreatedDto } from './dto/permission-created.dto';
import { PermissionUpdatedDto } from './dto/permission-updated.dto';

@Controller()
export class AppController {
  constructor(private readonly app: AppService) {}

  @MessagePattern('create_role')
  handleCreateRole(createRoleDto: CreateRoleDto) {
    return this.app.createRole(createRoleDto);
  }

  @MessagePattern('get_roles')
  handleGetRoles() {
    return this.app.getRoles();
  }

  @MessagePattern('get_role')
  handleGetRole(id: string) {
    return this.app.getRole(id);
  }

  @MessagePattern('update_role')
  handleUpdateRole({
    id,
    updateRoleDto: updatePermissionDto,
  }: {
    id: string;
    updateRoleDto: UpdateRoleDto;
  }) {
    return this.app.updateRole(id, updatePermissionDto);
  }

  @MessagePattern('delete_role')
  handleDeleteRole(id: string) {
    return this.app.getRole(id);
  }

  @EventPattern('permission_created')
  handlePermissionCreated(permissionCreatedDto: PermissionCreatedDto) {
    this.app.SyncPermissionCreated(permissionCreatedDto);
  }

  @EventPattern('permission_updated')
  handlePermissionUpdated(permissionUpdatedDto: PermissionUpdatedDto) {
    this.app.SyncPermissionUpdated(permissionUpdatedDto);
  }

  @EventPattern('permission_deleted')
  handlePermissionDeleted(id: string) {
    this.app.SyncPermissionDeleted(id);
  }

  @EventPattern('permissions_deleted')
  handlePermissionsDeleted(ids: string[]) {
    this.app.SyncPermissionsDeleted(ids);
  }
}
