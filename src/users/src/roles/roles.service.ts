import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    const role = await this.prismaService.role.create({
      data: {
        name: createRoleDto.name,
        level: createRoleDto.level,
        permissions: {
          connect: createRoleDto.permission_ids.map((id) => ({ id })),
        },
      },
      include: {
        permissions: true,
      },
    });
    return role;
  }

  async findAll() {
    const roles = await this.prismaService.role.findMany({
      include: {
        permissions: true,
      },
    });
    return roles;
  }

  async findOne(id: string) {
    const role = await this.prismaService.role.findUnique({
      where: {
        id,
      },
      include: {
        permissions: true,
      },
    });
    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  async remove(id: string) {
    const role = await this.prismaService.role.delete({
      where: {
        id,
      },
      include: {
        permissions: true,
      },
    });
    return role;
  }
}
