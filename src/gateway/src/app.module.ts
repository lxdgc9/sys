import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PermissionsModule } from './permissions/permissions.module';
import { PermissionGroupsModule } from './permission-groups/permission-groups.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [PermissionsModule, PermissionGroupsModule, RolesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
