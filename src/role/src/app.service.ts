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
}
