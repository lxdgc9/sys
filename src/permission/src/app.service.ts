import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaService } from './prisma/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { CreatePermissionGroupDto } from './dto/create-permission-group.dto';
import { UpdatePermissionGroupDto } from './dto/update-permission-group.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { DeletePermissionsDto } from './dto/delete-permission-batch.dto';
import { CreatePermissionsDto } from './dto/create-permission-batch.dto';

@Injectable()
export class AppService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('NATS') private readonly natsClient: ClientProxy,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createPermission(createPermissionDto: CreatePermissionDto) {
    const permission = await this.prismaService.permission.create({
      data: {
        code: createPermissionDto.code,
        description: createPermissionDto.description,
        group: {
          connect: {
            id: createPermissionDto.permissionGroupId,
          },
        },
      },
      include: {
        group: true,
      },
    });

    this.natsClient.emit('permission_created', permission);

    return permission;
  }

  async createPermissions(createPermissionsDto: CreatePermissionsDto) {
    const result = await this.prismaService.permission.createMany({
      data: createPermissionsDto.permissions.map((permission) => ({
        code: permission.code,
        description: permission.description,
        group_id: permission.permissionGroupId,
      })),
    });
    return result;
  }

  async getPermissions() {
    const permissions = await this.prismaService.permission.findMany({
      include: {
        group: true,
      },
    });
    return permissions;
  }

  async getPermission(id: string) {
    const permission = await this.prismaService.permission.findUnique({
      where: {
        id,
      },
      include: {
        group: true,
      },
    });
    return permission;
  }

  async updatePermission(id: string, updatePermissionDto: UpdatePermissionDto) {
    const permission = await this.prismaService.permission.update({
      where: {
        id,
      },
      data: {
        code: updatePermissionDto.code,
        description: updatePermissionDto.description,
        group:
          updatePermissionDto.permissionGroupId !== null
            ? {
                connect: {
                  id: updatePermissionDto.permissionGroupId,
                },
              }
            : undefined,
      },
      include: {
        group: true,
      },
    });

    return permission;
  }

  async deletePermission(id: string) {
    const permission = await this.prismaService.permission.delete({
      where: {
        id,
      },
      include: {
        group: true,
      },
    });
    return permission;
  }

  async deletePermissions(deletePermissionsDto: DeletePermissionsDto) {
    const result = await this.prismaService.permission.deleteMany({
      where: {
        id: {
          in: deletePermissionsDto.ids,
        },
      },
    });
    return result;
  }

  async createPermissionGroup(
    createPermissionGroupDto: CreatePermissionGroupDto,
  ) {
    const group = await this.prismaService.permissionGroup.create({
      data: {
        name: createPermissionGroupDto.name,
      },
    });
    return group;
  }

  async getPermissionGroups() {
    const groups = await this.prismaService.permissionGroup.findMany({
      include: {
        permissions: true,
      },
    });
    return groups;
  }

  async getPermissionGroup(id: string) {
    const group = await this.prismaService.permissionGroup.findUnique({
      where: {
        id,
      },
      include: {
        permissions: true,
      },
    });
    return group;
  }

  async updatePermissionGroup(
    id: string,
    updatePermissionGroupDto: UpdatePermissionGroupDto,
  ) {
    const group = await this.prismaService.permissionGroup.update({
      where: {
        id,
      },
      data: {
        name: updatePermissionGroupDto.name,
      },
      include: {
        permissions: true,
      },
    });
    return group;
  }

  async deletePermissionGroup(id: string) {
    const group = await this.prismaService.permissionGroup.delete({
      where: {
        id,
      },
      include: {
        permissions: true,
      },
    });
    return group;
  }
}
