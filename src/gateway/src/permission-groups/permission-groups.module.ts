import { Module } from '@nestjs/common';
import { PermissionGroupsService } from './permission-groups.service';
import { PermissionGroupsController } from './permission-groups.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PERMISSION_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: 'http://localhost:52321',
          queue: 'permission',
        },
      },
    ]),
  ],
  controllers: [PermissionGroupsController],
  providers: [PermissionGroupsService],
})
export class PermissionGroupsModule {}
