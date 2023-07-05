export class CreateRoleEvent {
  constructor(
    public readonly name: string,
    public readonly level: number,
    public readonly permissionIds: string[] | undefined,
  ) {}
}
