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

  constructor(
    id: string,
    name: string,
    date: Date,
    hairdresser: string,
    status: BookingStatus,
  ) {
    this._id = id;
    this._name = name;
    this._date = date;
    this._hairdresser = hairdresser;
    this._status = status;
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
}
