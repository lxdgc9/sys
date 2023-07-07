export class LoginEvent {
  constructor(
    public readonly k: string,
    public readonly v: string,
    public readonly password: string,
  ) {}
}
