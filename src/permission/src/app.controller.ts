import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern('create_permission')
  handleCreatePermission(data: any) {
    return this.appService.createPermission(data);
  }

  @MessagePattern('create_permissions')
  handleCreatePermissions(data: any) {
    return this.appService.createPermissions(data);
  }

  @MessagePattern('get_permissions')
  handleGetPermissions() {
    return this.appService.getPermissions();
  }

  @MessagePattern('get_permission')
  handleGetPermission(id: string) {
    return this.appService.getPermission(id);
  }

  @MessagePattern('update_permission')
  handleUpdatePermission(data: any) {
    return this.appService.updatePermission(data.id, data);
  }

  @MessagePattern('delete_permission')
  handleDeletePermission(id: string) {
    return this.appService.deletePermission(id);
  }

  @MessagePattern('delete_permissions')
  handleDeletePermissions(data: any) {
    return this.appService.deletePermissions(data);
  }

  @MessagePattern('create_permission_group')
  handleCreatePermissionGroup(data: any) {
    return this.appService.createPermissionGroup(data);
  }

  @MessagePattern('get_permission_groups')
  handleGetPermissionGroups() {
    return this.appService.getPermissionGroups();
  }

  @MessagePattern('get_permission_group')
  handleGetPermissionGroup(id: string) {
    return this.appService.getPermissionGroup(id);
  }

  @MessagePattern('update_permission_group')
  handleUpdatePermissionGroup(data: any) {
    return this.appService.updatePermissionGroup(data.id, data);
  }

  @MessagePattern('delete_permission_group')
  handleDeletePermissionGroup(id: string) {
    return this.appService.deletePermissionGroup(id);
  }
}
