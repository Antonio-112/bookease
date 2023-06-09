import { Booking, BookingStatus } from '../booking.entity';

export interface IBookingRepository {
  create(booking: Booking): Promise<Booking>;
  findAll(): Promise<Booking[]>;
  findById(id: string): Promise<Booking>;
  update(id: string, booking: Booking): Promise<Booking>;
  delete(id: string): Promise<void>;
  findByHairdresserAndTimeRange(
    hairdresser: string,
    startTime: Date,
    endTime: Date,
  ): Promise<Booking[]>;
  findByTimeRange(startTime: Date, endTime: Date): Promise<Booking[]>;
  findByStatus(status: string): Promise<Booking[]>;
  updateStatus(id: string, status: BookingStatus): Promise<Booking>;
}
