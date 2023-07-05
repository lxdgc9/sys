export class PermissionCreatedEvent {
  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly description: string | undefined,
  ) {}
}
