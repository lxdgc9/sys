export class CreatePermissionEvent {
  constructor(
    public readonly code: string,
    public readonly description: string | undefined,
    public readonly permissionGroupId: string,
  ) {}

  toString() {
    return JSON.stringify({
      code: this.code,
      description: this.description,
      permissionGroupId: this.permissionGroupId,
    });
  }
}
