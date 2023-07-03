import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PermissionsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createPermissionDto: CreatePermissionDto) {
    const permission = await this.prismaService.permission.create({
      data: {
        code: createPermissionDto.code,
        description: createPermissionDto.description,
        group: {
          connect: {
            id: createPermissionDto.group_id,
          },
        },
      },
    });

    await this.prismaService.permissionGroup.update({
      where: {
        id: permission.group_id,
      },
      data: {},
    });

    return permission;
  }

  async createBatch(createPermissionDtos: CreatePermissionDto[]) {
    const permissions = await this.prismaService.$transaction([
      this.prismaService.permission.createMany({
        data: createPermissionDtos.map((el) => ({
          code: el.code,
          description: el.description,
          group_id: el.group_id,
        })),
      }),
    ]);
    return permissions;
  }

  async findAll() {
    const permissions = await this.prismaService.permission.findMany({
      include: {
        group: true,
      },
    });
    return permissions;
  }

  async findOne(id: string) {
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

  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    let data: any = {};

    if (updatePermissionDto.group_id) {
      data.group = {
        connect: {
          id: updatePermissionDto.group_id,
        },
      };
    }

    const permission = await this.prismaService.permission.update({
      where: {
        id,
      },
      data: {
        code: updatePermissionDto.code,
        description: updatePermissionDto.description,
        group: updatePermissionDto.group_id
          ? { connect: { id: updatePermissionDto.group_id } }
          : undefined,
      },
      include: {
        group: true,
      },
    });
    return permission;
  }

  async remove(id: string) {
    const permission = await this.prismaService.permission.delete({
      where: {
        id,
      },
    });
    return permission;
  }

  async removeBatch(ids: string[]) {
    const permissions = await this.prismaService.$transaction([
      this.prismaService.permission.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      }),
    ]);
    return permissions;
  }
}
