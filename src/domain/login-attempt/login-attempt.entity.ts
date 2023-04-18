export class LoginAttempt {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly ipAddress: string,
    public readonly createdAt: Date,
  ) {}
}
