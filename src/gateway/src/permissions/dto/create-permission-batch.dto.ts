import { IsNotEmpty } from 'class-validator';
import { CreatePermissionDto } from './create-permission.dto';

export class CreatePermissionsDto {
  @IsNotEmpty()
  permissions: CreatePermissionDto[];
}
