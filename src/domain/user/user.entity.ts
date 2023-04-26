export class User {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _email: string;
  private readonly _password: string;

  constructor(id: string, name: string, email: string, password: string) {
    this._id = id;
    this._name = name;
    this._email = email;
    this._password = password;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }
}
