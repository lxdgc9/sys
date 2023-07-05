export class RoleCreatedEvent {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly level: number,
    public readonly permissionIds: string[] | undefined,
  ) {}
}
