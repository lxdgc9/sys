export class CreateRoleDto {
  name: string;
  level: number;
  permissionIds?: string[];
}
