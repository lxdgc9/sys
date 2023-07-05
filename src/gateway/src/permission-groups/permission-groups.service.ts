import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreatePermissionGroupDto } from './dto/create-permission-group.dto';
import { UpdatePermissionGroupDto } from './dto/update-permission-group.dto';
import { CreatePermissionGroupEvent } from './events/create-permission-group.event';
import { UpdatePermissionGroupEvent } from './events/update-permission-group.event';
import { DeletePermissionGroupsDto } from './dto/delete-permission-group-batch.dto';

@Injectable()
export class PermissionGroupsService {
  constructor(
    @Inject('PERMISSION_SERVICE')
    private readonly permission: ClientProxy,
  ) {}

  create(createPermissionGroupDto: CreatePermissionGroupDto) {
    return this.permission.send(
      'create_permission_group',
      new CreatePermissionGroupEvent(createPermissionGroupDto.name),
    );
  }

  findAll() {
    return this.permission.send('get_permission_groups', {});
  }

  findOne(id: string) {
    return this.permission.send('get_permission_group', id);
  }

  update(id: string, updatePermissionGroupDto: UpdatePermissionGroupDto) {
    return this.permission.send(
      'update_permission_group',
      new UpdatePermissionGroupEvent(id, updatePermissionGroupDto.name),
    );
  }

  remove(id: string) {
    return this.permission.send('delete_permission_group', id);
  }

  removeBatch(deletePermissionGroupsDto: DeletePermissionGroupsDto) {
    return this.permission.send(
      'delete_permission_groups',
      deletePermissionGroupsDto.ids,
    );
  }
}
