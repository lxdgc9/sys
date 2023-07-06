import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { DeletePermissionsDto } from './dto/delete-permission.dto';
import { CreatePermissionEvent } from './events/create-permission.event';
import { UpdatePermissionEvent } from './events/update-permission.event';
import { DeletePermissionsEvent } from './events/delete-permission-batch.event';

@Injectable()
export class PermissionsService {
  constructor(
    @Inject('PERMISSION_SERVICE')
    private readonly permission: ClientProxy,
  ) {}

  create(createPermissionDto: CreatePermissionDto) {
    return this.permission.send(
      'create_permission',
      new CreatePermissionEvent(
        createPermissionDto.code,
        createPermissionDto.description,
        createPermissionDto.group_id,
      ),
    );
  }

  findAll() {
    return this.permission.send('get_permissions', {});
  }

  findOne(id: string) {
    return this.permission.send('get_permission', id);
  }

  update(id: string, updatePermissionDto: UpdatePermissionDto) {
    return this.permission.send(
      'update_permission',
      new UpdatePermissionEvent(
        id,
        updatePermissionDto.code,
        updatePermissionDto.description,
        updatePermissionDto.group_id,
      ),
    );
  }

  removeBatch(deletePermissionsDto: DeletePermissionsDto) {
    return this.permission.send(
      'delete_permissions',
      new DeletePermissionsEvent(deletePermissionsDto.ids),
    );
  }

  remove(id: string) {
    return this.permission.send('delete_permission', id);
  }
}
