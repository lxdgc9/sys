import { Injectable } from '@nestjs/common';
import { CreatePermissionGroupDto } from './dto/create-permission-group.dto';
import { UpdatePermissionGroupDto } from './dto/update-permission-group.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PermissionGroupsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createPermissionGroupDto: CreatePermissionGroupDto) {
    const group = await this.prismaService.permissionGroup.create({
      data: createPermissionGroupDto,
    });
    return group;
  }

  async findAll() {
    const groups = await this.prismaService.permissionGroup.findMany({
      include: {
        permissions: true,
      },
    });
    return groups;
  }

  async findOne(id: string) {
    const group = await this.prismaService.permissionGroup.findUnique({
      where: {
        id,
      },
    });
    return group;
  }

  update(id: number, updatePermissionGroupDto: UpdatePermissionGroupDto) {
    return `This action updates a #${id} permissionGroup`;
  }

  async remove(id: string) {
    const group = await this.prismaService.permissionGroup.delete({
      where: {
        id,
      },
    });
    return group;
  }
}
