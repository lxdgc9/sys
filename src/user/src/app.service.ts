import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { compare, genSalt, hash } from 'bcrypt';
import { PrismaService } from './prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { PermissionCreatedDto } from './dto/permission-created.dto';
import { PermissionUpdatedDto } from './dto/permission-updated.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleCreatedDto } from './dto/role-created.dto';
import { RoleUpdatedDto } from './dto/role-updated.dto';

@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('NATS') private readonly nats: ClientProxy,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        ufields: {
          is: {
            [`${loginDto.k}`]: loginDto.v,
          },
        },
      },
    });
    if (!user) {
      return null;
    }

    const isMatch = await compare(loginDto.password, user.password);
    if (!isMatch) {
      return null;
    }

    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    const salt = await genSalt(10);
    const hashedPassword = await hash(createUserDto.password, salt);
    const user = await this.prisma.user.create({
      data: {
        ufields: {
          set: {
            username: createUserDto.ufields.username,
            phone: createUserDto.ufields.phone,
            email: createUserDto.ufields.email,
          },
        },
        password: hashedPassword,
        attrs: createUserDto.attrs.map((attr) => ({ k: attr.k, v: attr.v })),
        role: {
          connect: {
            id: createUserDto.roleId,
          },
        },
        spec_permissions: createUserDto.specPermissionIds
          ? {
              connect: createUserDto.specPermissionIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
        spec_permissions: true,
      },
    });

    if (user) {
      this.nats.emit('user_created', user);
    }

    return user;
  }

  async getUsers() {
    return await this.prisma.user.findMany({
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
        spec_permissions: true,
      },
    });
  }

  async getUser(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
        spec_permissions: true,
      },
    });
  }

  async updateUser(id: string, data: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: undefined,
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
        spec_permissions: true,
      },
    });

    return user;
  }

  async deleteUsers(ids: string[]) {
    const result = await this.prisma.user.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    if (result) {
    }

    return result;
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.delete({
      where: {
        id,
      },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
        spec_permissions: true,
      },
    });

    if (user) {
    }

    return user;
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

  async syncRoleCreated(roleCreatedDto: RoleCreatedDto) {
    await this.prisma.role.create({
      data: {
        id: roleCreatedDto.id,
        name: roleCreatedDto.name,
        level: roleCreatedDto.level,
        permissions: roleCreatedDto.permissionIds
          ? {
              connect: roleCreatedDto.permissionIds.map((id) => ({ id })),
            }
          : undefined,
      },
    });
  }

  async syncRoleUpdated(roleUpdatedDto: RoleUpdatedDto) {
    await this.prisma.role.update({
      where: {
        id: roleUpdatedDto.id,
      },
      data: {
        name: roleUpdatedDto.name,
        level: roleUpdatedDto.level,
        permissions: roleUpdatedDto.permissionIds
          ? {
              connect: roleUpdatedDto.permissionIds.map((id) => ({ id })),
            }
          : undefined,
      },
    });
  }

  async syncRolesDeleted(ids: string[]) {
    await this.prisma.role.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async syncRoleDeleted(id: string) {
    await this.prisma.role.delete({
      where: {
        id,
      },
    });
  }
}
