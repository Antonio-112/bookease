export class UpdatePasswordCommand {
  constructor(
    public readonly id: string,
    public readonly newPassword: string,
    public readonly oldPassword: string,
  ) {}
}
