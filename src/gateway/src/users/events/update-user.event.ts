export class UpdateUserEvent {
  constructor(
    public readonly id: string,
    public readonly name: string | undefined,
    public readonly level: number | undefined,
    public readonly permissionIds: string[] | undefined,
  ) {}
}
