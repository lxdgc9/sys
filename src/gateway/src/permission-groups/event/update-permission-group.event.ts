export class UpdatePermissionGroupEvent {
  constructor(
    public readonly id: string,
    public readonly name: string | undefined,
  ) {}

  toString() {
    return JSON.stringify({
      id: this.id,
      name: this.name,
    });
  }
}
