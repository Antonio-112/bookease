/**
 * Enum to represent the different statuses of a booking.
 */
export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

/**
 * Represents a booking in the system.
 */
export class Booking {
  /**
   * Unique identifier of the booking.
   */
  private readonly _id: string;

  /**
   * Name of the person who made the booking.
   */
  private readonly _name: string;

  /**
   * Date and time of the booking.
   */
  private readonly _date: Date;

  /**
   * Name of the hairdresser assigned to the booking.
   */
  private readonly _hairdresser: string;

  /**
   * Current status of the booking.
   */
  private readonly _status: BookingStatus;

  /**
   * Service requested for the booking.
   */
  private readonly _service: string[];

  /**
   * Price of the service requested.
   */
  private readonly _price: number;

  /**
   * Duration of the service in minutes.
   */
  private readonly _duration: number;

  /**
   * Additional notes for the booking.
   */
  private readonly _note: string;

  /**
   * Phone number of the customer.
   */
  private readonly _phoneNumber: string;

  constructor(
    id: string,
    name: string,
    date: Date,
    hairdresser: string,
    status: BookingStatus,
    service: string[],
    price: number,
    duration: number,
    note: string,
    phoneNumber: string,
  ) {
    this._id = id;
    this._name = name;
    this._date = date;
    this._hairdresser = hairdresser;
    this._status = status;
    this._service = service;
    this._price = price;
    this._duration = duration;
    this._note = note;
    this._phoneNumber = phoneNumber;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get date(): Date {
    return this._date;
  }

  get hairdresser(): string {
    return this._hairdresser;
  }

  get status(): BookingStatus {
    return this._status;
  }

  get service(): string[] {
    return this._service;
  }

  get price(): number {
    return this._price;
  }

  get duration(): number {
    return this._duration;
  }

  get note(): string {
    return this._note;
  }

  get phoneNumber(): string {
    return this._phoneNumber;
  }
}
