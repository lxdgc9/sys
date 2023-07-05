import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { DeleteRolesDto } from './dto/delete-role-batch.dto';
import { CreateRoleEvent } from './events/create-role.event';
import { UpdateRoleEvent } from './events/update-role.event';

@Injectable()
export class RolesService {
  constructor(@Inject('ROLE_SERVICE') private readonly role: ClientProxy) {}

  create(createRoleDto: CreateRoleDto) {
    return this.role.send(
      'create_role',
      new CreateRoleEvent(
        createRoleDto.name,
        createRoleDto.level,
        createRoleDto.permission_ids,
      ),
    );
  }

  findAll() {
    return this.role.send('get_roles', {});
  }

  findOne(id: string) {
    return this.role.send('get_role', id);
  }

  update(id: string, updateRoleDto: UpdateRoleDto) {
    return this.role.send(
      'update_role',
      new UpdateRoleEvent(
        id,
        updateRoleDto.name,
        updateRoleDto.level,
        updateRoleDto.permission_ids,
      ),
    );
  }

  remove(id: string) {
    return this.role.send('delete_role', id);
  }

  removeBatch(deleteRolesDto: DeleteRolesDto) {
    return this.role.send('delete_roles', deleteRolesDto.ids);
  }
}
