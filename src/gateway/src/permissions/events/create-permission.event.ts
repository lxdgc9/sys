export class CreatePermissionEvent {
  constructor(
    public readonly code: string,
    public readonly description: string | undefined,
    public readonly groupId: string,
  ) {}
}
