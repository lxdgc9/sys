import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePermissionGroupDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
