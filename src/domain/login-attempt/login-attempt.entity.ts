export class LoginAttempt {
  private readonly _id: string;
  private readonly _email: string;
  private readonly _ipAddress: string;
  private readonly _createdAt: Date;

  constructor(id: string, email: string, ipAddress: string, createdAt: Date) {
    this._id = id;
    this._email = email;
    this._ipAddress = ipAddress;
    this._createdAt = createdAt;
  }

  get id(): string {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  get ipAddress(): string {
    return this._ipAddress;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}
