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
    ...updateRoleDto
  }: {
    id: string;
    updateRoleDto: UpdateRoleDto;
  }) {
    return this.app.updateRole(id, updateRoleDto as UpdateRoleDto);
  }

  @MessagePattern('delete_roles')
  handleDeleteRoles(ids: string[]) {
    return this.app.deleteRoles(ids);
  }

  @MessagePattern('delete_role')
  handleDeleteRole(id: string) {
    return this.app.deleteRole(id);
  }

  @EventPattern('permission_created')
  handlePermissionCreated(permissionCreatedDto: PermissionCreatedDto) {
    this.app.syncPermissionCreated(permissionCreatedDto);
  }

  @EventPattern('permission_updated')
  handlePermissionUpdated(permissionUpdatedDto: PermissionUpdatedDto) {
    this.app.syncPermissionUpdated(permissionUpdatedDto);
  }

  @EventPattern('permissions_deleted')
  handlePermissionsDeleted(ids: string[]) {
    this.app.syncPermissionsDeleted(ids);
  }

  @EventPattern('permission_deleted')
  handlePermissionDeleted(id: string) {
    this.app.syncPermissionDeleted(id);
  }
}
