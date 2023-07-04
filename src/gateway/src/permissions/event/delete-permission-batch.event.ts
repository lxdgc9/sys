export class DeletePermissionsEvent {
  constructor(public readonly ids: string[]) {}

  toString() {
    return JSON.stringify({
      ids: this.ids,
    });
  }
}
