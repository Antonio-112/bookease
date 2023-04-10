import { Booking } from '../booking/booking.entity';

export interface IBookingRepository {
  create(booking: Booking): Promise<Booking>;
  findAll(): Promise<Booking[]>;
  findById(id: string): Promise<Booking>;
  update(id: string, booking: Booking): Promise<Booking>;
  delete(id: string): Promise<boolean>;
}
