export class CreatePermissionsEvent {
  constructor(
    public readonly permissions: {
      code: string;
      description?: string;
      permissionGroupId: string;
    }[],
  ) {}

  toString() {
    return JSON.stringify(
      this.permissions.map((permission) => ({
        code: permission.code,
        description: permission.description,
        permissionGroupId: permission.permissionGroupId,
      })),
    );
  }
}
