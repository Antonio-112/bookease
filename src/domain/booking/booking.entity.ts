export class Booking {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly date: Date,
    public readonly hairdresser: string,
    public readonly status: string,
  ) {
    this.date = date;
  }
}
