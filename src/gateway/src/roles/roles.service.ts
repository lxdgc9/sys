import { Inject, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ClientProxy } from '@nestjs/microservices';
import { CreateRoleEvent } from './events/create-role.event';
import { DeleteRolesDto } from './dto/delete-role-batch.dto';

@Injectable()
export class RolesService {
  constructor(
    @Inject('ROLE_SERVICE') private readonly roleClient: ClientProxy,
  ) {}

  create(createRoleDto: CreateRoleDto) {
    const role = this.roleClient.send(
      'create_role',
      new CreateRoleEvent(
        createRoleDto.name,
        createRoleDto.level,
        createRoleDto.permission_ids,
      ),
    );
    return role;
  }

  findAll() {
    const roles = this.roleClient.send('get_roles', {});
    return roles;
  }

  findOne(id: string) {
    const role = this.roleClient.send('get_role', id);
    return role;
  }

  update(id: string, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: string) {
    const role = this.roleClient.send('delete_role', id);
    return role;
  }

  removeBatch(deleteRolesDto: DeleteRolesDto) {
    const result = this.roleClient.send('delete_roles', deleteRolesDto.ids);
    return result;
  }
}
