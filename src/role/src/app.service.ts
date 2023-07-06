import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaService } from './prisma/prisma.service';
import { PermissionCreatedDto } from './dto/permission-created.dto';
import { PermissionUpdatedDto } from './dto/permission-updated.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleCreatedEvent } from './events/role-created.event';
import { RoleUpdatedEvent } from './events/role-updated.event';

@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('NATS') private readonly nats: ClientProxy,
  ) {}

  async createRole(createRoleDto: CreateRoleDto) {
    const role = await this.prisma.role.create({
      data: {
        name: createRoleDto.name,
        level: createRoleDto.level,
        permissions:
          createRoleDto.permission_ids !== null
            ? {
                connect: createRoleDto.permission_ids.map((id) => ({ id })),
              }
            : undefined,
      },
    });

    if (role) {
      this.nats.emit(
        'role_created',
        new RoleCreatedEvent(
          role.id,
          role.name,
          role.level,
          role.permission_ids,
        ),
      );
    }

    return role;
  }

  async getRoles() {
    return await this.prisma.role.findMany({
      include: {
        permissions: true,
      },
    });
  }

  async getRole(id: string) {
    return await this.prisma.role.findUnique({
      where: {
        id,
      },
      include: {
        permissions: true,
      },
    });
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.prisma.role.update({
      where: {
        id,
      },
      data: {
        name: updateRoleDto.name,
        level: updateRoleDto.level,
        permissions:
          updateRoleDto.permission_ids !== null
            ? {
                connect: updateRoleDto.permission_ids.map((id) => ({ id })),
              }
            : undefined,
      },
      include: {
        permissions: true,
      },
    });

    if (role) {
      this.nats.emit(
        'role_updated',
        new RoleUpdatedEvent(
          role.id,
          role.name,
          role.level,
          role.permission_ids,
        ),
      );
    }

    return role;
  }

  async deleteRoles(ids: string[]) {
    const result = await this.prisma.role.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    if (result) {
      this.nats.emit('roles_deleted', ids);
    }

    return result;
  }

  async deleteRole(id: string) {
    const role = await this.prisma.role.delete({
      where: {
        id,
      },
      include: {
        permissions: true,
      },
    });

    if (role) {
      this.nats.emit('role_deleted', role.id);
    }

    return role;
  }

  async syncPermissionCreated(permissionCreatedDto: PermissionCreatedDto) {
    await this.prisma.permission.create({
      data: {
        id: permissionCreatedDto.id,
        code: permissionCreatedDto.code,
        description: permissionCreatedDto.description,
      },
    });
  }

  async syncPermissionUpdated(permissionUpdatedDto: PermissionUpdatedDto) {
    await this.prisma.permission.update({
      where: {
        id: permissionUpdatedDto.id,
      },
      data: {
        code: permissionUpdatedDto.code,
        description: permissionUpdatedDto.description,
      },
    });
  }

  async syncPermissionsDeleted(ids: string[]) {
    await this.prisma.permission.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async syncPermissionDeleted(id: string) {
    await this.prisma.permission.delete({
      where: {
        id,
      },
    });
  }
}
