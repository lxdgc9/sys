export class UpdatePermissionEvent {
  constructor(
    public readonly id: string,
    public readonly code: string | undefined,
    public readonly description: string | undefined,
    public readonly groupId: string | undefined,
  ) {}

  toString() {
    return JSON.stringify({
      id: this.id,
      code: this.code,
      description: this.description,
      groupId: this.groupId,
    });
  }
}
