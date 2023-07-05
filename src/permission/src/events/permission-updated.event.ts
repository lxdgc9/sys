export class PermissionUpdatedEvent {
  constructor(
    public readonly id: string,
    public readonly code: string | undefined,
    public readonly description: string | undefined,
  ) {}
}
