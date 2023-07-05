import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PermissionCreatedDto } from './dto/permission-created.dto';

@Injectable()
export class AppService {
  constructor(private readonly prismaService: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async SyncPermissionCreated(permissionCreatedDto: PermissionCreatedDto) {
    await this.prismaService.permission.create({
      data: {
        id: permissionCreatedDto.id,
        code: permissionCreatedDto.code,
        description: permissionCreatedDto.description,
      },
    });
  }

  async SyncPermissionDeleted(id: string) {
    await this.prismaService.permission.delete({
      where: {
        id,
      },
    });
  }

  async SyncPermissionsDeleted(ids: string[]) {
    await this.prismaService.permission.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}
