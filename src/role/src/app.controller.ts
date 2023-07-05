import { Controller, Get } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @EventPattern('permission_created')
  handlePermissionCreated(data: any) {
    this.appService.SyncPermissionCreated(data);
  }

  @EventPattern('permission_deleted')
  handlePermissionDeleted(id: string) {
    this.appService.SyncPermissionDeleted(id);
  }

  @EventPattern('permissions_deleted')
  handlePermissionsDeleted(ids: string[]) {
    this.appService.SyncPermissionsDeleted(ids);
  }
}
