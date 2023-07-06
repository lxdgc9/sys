export class CreateUserEvent {
  constructor(
    public readonly name: string,
    public readonly level: number,
    public readonly permissionIds: string[] | undefined,
  ) {}
}
