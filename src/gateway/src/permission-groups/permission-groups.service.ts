import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreatePermissionGroupDto } from './dto/create-permission-group.dto';
import { UpdatePermissionGroupDto } from './dto/update-permission-group.dto';
import { CreatePermissionGroupEvent } from './event/create-permission-group.event';
import { UpdatePermissionGroupEvent } from './event/update-permission-group.event';

@Injectable()
export class PermissionGroupsService {
  constructor(
    @Inject('PERMISSION_SERVICE')
    private readonly permissionClient: ClientProxy,
  ) {}

  create(createPermissionGroupDto: CreatePermissionGroupDto) {
    const group = this.permissionClient.send(
      'create_permission_group',
      new CreatePermissionGroupEvent(createPermissionGroupDto.name),
    );
    return group;
  }

  findAll() {
    const groups = this.permissionClient.send('get_permission_groups', {});
    return groups;
  }

  findOne(id: string) {
    const group = this.permissionClient.send('get_permission_group', id);
    return group;
  }

  update(id: string, updatePermissionGroupDto: UpdatePermissionGroupDto) {
    const group = this.permissionClient.send(
      'update_permission_group',
      new UpdatePermissionGroupEvent(id, updatePermissionGroupDto.name),
    );
    return group;
  }

  remove(id: string) {
    const group = this.permissionClient.send('delete_permission_group', id);
    return group;
  }
}
