import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PermissionCreatedDto } from './dto/permission-created.dto';
import { PermissionUpdatedDto } from './dto/permission-updated.dto';
import { RoleCreatedDto } from './dto/role-created.dto';
import { RoleUpdatedDto } from './dto/role-updated.dto';

@Controller()
export class AppController {
  constructor(private readonly app: AppService) {}

  @MessagePattern('create_user')
  handleCreateUser(createUserDto: CreateUserDto) {
    return this.app.createUser(createUserDto);
  }

  @MessagePattern('get_users')
  handleGetUsers() {
    return this.app.getUsers();
  }

  @MessagePattern('get_user')
  handleGetUser(id: string) {
    return this.app.getUser(id);
  }

  @MessagePattern('update_user')
  handleUpdateUser({
    id,
    ...updateUserDto
  }: {
    id: string;
    updateUserDto: UpdateUserDto;
  }) {
    return this.app.updateUser(id, updateUserDto as UpdateUserDto);
  }

  @MessagePattern('delete_users')
  handleDeleteUsers(ids: string[]) {
    return this.app.deleteUsers(ids);
  }

  @MessagePattern('delete_user')
  handleDeleteUser(id: string) {
    return this.app.deleteUser(id);
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

  @EventPattern('role_created')
  handleRoleCreated(roleCreatedDto: RoleCreatedDto) {
    this.app.syncRoleCreated(roleCreatedDto);
  }

  @EventPattern('role_updated')
  handleRoleUpdated(roleUpdatedDto: RoleUpdatedDto) {
    this.app.syncRoleUpdated(roleUpdatedDto);
  }

  @EventPattern('roles_deleted')
  handleRolesDeleted(ids: string[]) {
    this.app.syncRolesDeleted(ids);
  }

  @EventPattern('role_deleted')
  handleRoleDeleted(id: string) {
    this.app.syncRoleDeleted(id);
  }
}
