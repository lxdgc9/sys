import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { CreatePermissionEvent } from './events/create-permission.event';
import { UpdatePermissionEvent } from './events/update-permission.event';
import { DeletePermissionsDto } from './dto/delete-permission-batch.dto';
import { DeletePermissionsEvent } from './events/delete-permission-batch.event';

@Injectable()
export class PermissionsService {
  constructor(
    @Inject('PERMISSION_SERVICE')
    private readonly permissionClient: ClientProxy,
  ) {}

  create(createPermissionDto: CreatePermissionDto) {
    const permission = this.permissionClient.send(
      'create_permission',
      new CreatePermissionEvent(
        createPermissionDto.code,
        createPermissionDto.description,
        createPermissionDto.group_id,
      ),
    );
    return permission;
  }

  findAll() {
    const permissions = this.permissionClient.send('get_permissions', {});
    return permissions;
  }

  findOne(id: string) {
    const permission = this.permissionClient.send('get_permission', id);
    return permission;
  }

  update(id: string, updatePermissionDto: UpdatePermissionDto) {
    const permission = this.permissionClient.send(
      'update_permission',
      new UpdatePermissionEvent(
        id,
        updatePermissionDto.code,
        updatePermissionDto.description,
        updatePermissionDto.group_id,
      ),
    );
    return permission;
  }

  remove(id: string) {
    const permission = this.permissionClient.send('delete_permission', id);
    return permission;
  }

  removeBatch(deletePermissionsDto: DeletePermissionsDto) {
    const permissions = this.permissionClient.send(
      'delete_permissions',
      new DeletePermissionsEvent(deletePermissionsDto.ids),
    );

    return permissions;
  }
}
