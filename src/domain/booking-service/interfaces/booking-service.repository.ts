import { BookingServices } from '../booking-service.entity';

export interface IBookingServiceRepository {
  create(bookingService: BookingServices): Promise<BookingServices>;
  findAll(): Promise<BookingServices[]>;
  findById(id: string): Promise<BookingServices>;
  update(id: string, BookingService: BookingServices): Promise<BookingServices>;
  delete(id: string): Promise<boolean>;
}
