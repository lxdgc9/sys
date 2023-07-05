export class CreateRoleDto {
  name: string;
  level: number;
  permission_ids?: string[];
}
