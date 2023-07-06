type UniqFields = {
  username: string;
  phone: string;
  email: string;
};

type Attr = {
  k: string;
  v: string;
};

export class CreateUserEvent {
  constructor(
    public readonly ufields: UniqFields,
    public readonly password: string,
    public readonly attrs: Attr[],
    public readonly roleId: string,
    public readonly specPermissionIds: string[],
    public readonly isActive: boolean | undefined,
  ) {}
}
