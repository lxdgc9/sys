export class UpdatePermissionGroupEvent {
  constructor(
    public readonly id: string,
    public readonly name: string | undefined,
  ) {}
}
