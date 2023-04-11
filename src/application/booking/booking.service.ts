import { Inject, Injectable } from '@nestjs/common';
import { Booking } from '../../domain/booking/booking.entity';
import { CreateBookingCommand } from './commands/create-booking.command';
import { UpdateBookingCommand } from './commands/update-booking.command';
import { DeleteBookingCommand } from './commands/delete-booking.command';
import { IBookingRepository } from 'src/domain/booking/interfaces/booking.repository';
import { GetBookingQuery } from './queries/get-booking.query';
import { GetBookingsQuery } from './queries/get-bookings.query';
import { IUserRepository } from '../../domain/user/interfaces/user.repository';

@Injectable()
export class BookingService {
  constructor(
    @Inject('IBookingRepository')
    private readonly bookingRepository: IBookingRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async isTimeSlotAvailable(date: Date, hairdresser: string): Promise<boolean> {
    const selectedDate = new Date(date);

    const startTime = new Date(date);
    startTime.setHours(9, 0, 0, 0);
    const endTime = new Date(date);
    endTime.setHours(18, 0, 0, 0);

    const selectedTime = selectedDate.getTime();

    if (
      selectedTime < startTime.getTime() ||
      selectedTime >= endTime.getTime()
    ) {
      return false;
    }

    for (
      let time = startTime;
      time < endTime;
      time.setHours(time.getHours() + 3)
    ) {
      const nextTime = new Date(time);
      nextTime.setHours(time.getHours() + 3);

      if (selectedTime >= time.getTime() && selectedTime < nextTime.getTime()) {
        const bookings =
          await this.bookingRepository.findByHairdresserAndTimeRange(
            hairdresser,
            time,
            nextTime,
          );
        return bookings.length === 0;
      }
    }

    return false;
  }

  async createBooking(command: CreateBookingCommand): Promise<Booking> {
    const user = await this.userRepository.findByName(
      command.createBookingDto.name,
    );
    if (!user) {
      throw new Error('User not found');
    }

    const { name, date, hairdresser, status } = command.createBookingDto;

    if (!(await this.isTimeSlotAvailable(date, hairdresser))) {
      throw new Error('Time slot is not available');
    }

    const booking = new Booking(null, name, date, hairdresser, status);

    return this.bookingRepository.create(booking);
  }

  async getBookings(query: GetBookingsQuery): Promise<Booking[]> {
    return this.bookingRepository.findAll();
  }

  async getBooking(query: GetBookingQuery): Promise<Booking> {
    return this.bookingRepository.findById(query.id);
  }

  async updateBooking(command: UpdateBookingCommand): Promise<Booking> {
    const user = await this.userRepository.findByName(
      command.updateBookingDto.name,
    );
    if (!user) {
      throw new Error('User not found');
    }

    const { name, date, hairdresser, status } = command.updateBookingDto;

    if (!(await this.isTimeSlotAvailable(date, hairdresser))) {
      throw new Error('Time slot is not available');
    }

    const booking = new Booking(command.id, name, date, hairdresser, status);

    return this.bookingRepository.update(command.id, booking);
  }

  async deleteBooking(command: DeleteBookingCommand): Promise<void> {
    return this.bookingRepository.delete(command.id);
  }
}
