import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ClientProxy } from '@nestjs/microservices';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionUpdatedEvent } from './events/permission-updated.event';
import { PermissionCreatedEvent } from './events/permission-created.event';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('NATS') private readonly nats: ClientProxy,
  ) {}

  async createPermission(createPermissionDto: CreatePermissionDto) {
    const permission = await this.prisma.permission.create({
      data: {
        code: createPermissionDto.code,
        description: createPermissionDto.description,
        group: {
          connect: {
            id: createPermissionDto.groupId,
          },
        },
      },
      include: {
        group: true,
      },
    });

    if (permission) {
      this.nats.emit(
        'permission_created',
        new PermissionCreatedEvent(
          permission.id,
          permission.code,
          permission.description,
        ),
      );
    }

    return permission;
  }

  async getPermissions() {
    return await this.prisma.permission.findMany({
      include: {
        group: true,
      },
    });
  }

  async getPermission(id: string) {
    return await this.prisma.permission.findUnique({
      where: {
        id,
      },
      include: {
        group: true,
      },
    });
  }

  async updatePermission(id: string, updatePermissionDto: UpdatePermissionDto) {
    const permission = await this.prisma.permission.update({
      where: {
        id,
      },
      data: {
        code: updatePermissionDto.code,
        description: updatePermissionDto.description,
        group:
          updatePermissionDto.groupId !== null
            ? {
                connect: {
                  id: updatePermissionDto.groupId,
                },
              }
            : undefined,
      },
      include: {
        group: true,
      },
    });

    if (permission) {
      this.nats.emit(
        'permission_updated',
        new PermissionUpdatedEvent(
          permission.id,
          permission.code,
          permission.description,
        ),
      );
    }

    return permission;
  }

  async deletePermission(id: string) {
    const permission = await this.prisma.permission.delete({
      where: {
        id,
      },
      include: {
        group: true,
      },
    });

    if (permission) {
      this.nats.emit('permission_deleted', permission.id);
    }

    return permission;
  }

  async deletePermissions(ids: string[]) {
    const result = await this.prisma.permission.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    if (result) {
      this.nats.emit('permissions_deleted', ids);
    }

    return result;
  }

  async createGroup(createGroupDto: CreateGroupDto) {
    return await this.prisma.group.create({
      data: {
        name: createGroupDto.name,
      },
    });
  }

  async getGroups() {
    return await this.prisma.group.findMany({
      include: {
        permissions: true,
      },
    });
  }

  async getGroup(id: string) {
    return await this.prisma.group.findUnique({
      where: {
        id,
      },
      include: {
        permissions: true,
      },
    });
  }

  async updateGroup(id: string, updateGroupDto: UpdateGroupDto) {
    return await this.prisma.group.update({
      where: {
        id,
      },
      data: {
        name: updateGroupDto.name,
      },
      include: {
        permissions: true,
      },
    });
  }

  async deleteGroup(id: string) {
    return await this.prisma.group.delete({
      where: {
        id,
      },
      include: {
        permissions: true,
      },
    });
  }

  async deleteGroups(ids: string[]) {
    return await this.prisma.group.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}
