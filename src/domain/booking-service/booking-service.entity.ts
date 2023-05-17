export class BookingServices {
  _id: string;
  name: string;
  price: number;
  duration: number;
  details: string;

  constructor(id: string, name: string, details: string, duration: number, price: number) {
    this._id = id;
    this.name = name;
    this.details = details;
    this.duration = duration;
    this.price = price;
  }
}
