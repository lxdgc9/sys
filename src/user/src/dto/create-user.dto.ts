export class CreateUserDto {
  ufields: {
    username: string;
    phone: string;
    email: string;
  };
  password: string;
  attrs: {
    k: string;
    v: string;
  }[];
  roleId: string;
  specPermissionIds: string[];
  isActive?: boolean;
}
