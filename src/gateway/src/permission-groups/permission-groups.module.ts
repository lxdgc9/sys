import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PermissionGroupsService } from './permission-groups.service';
import { PermissionGroupsController } from './permission-groups.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PERMISSION_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: process.env.NATS_URL,
        },
      },
    ]),
  ],
  controllers: [PermissionGroupsController],
  providers: [PermissionGroupsService],
})
export class PermissionGroupsModule {}
