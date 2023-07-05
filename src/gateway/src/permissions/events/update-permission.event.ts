export class UpdatePermissionEvent {
  constructor(
    public readonly id: string,
    public readonly code: string | undefined,
    public readonly description: string | undefined,
    public readonly groupId: string | undefined,
  ) {}
}
