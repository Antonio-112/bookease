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

  async createBooking(command: CreateBookingCommand): Promise<Booking> {
    // Check if the user exists
    const user = await this.userRepository.findByName(
      command.createBookingDto.name,
    );
    if (!user) {
      throw new Error('User not found');
    }
    const { name, date, hairdresser, status } = command.createBookingDto;
    // Add your business logic for creating a booking
    // check if the time slot is available, etc.

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
    // Check if the user exists
    const user = await this.userRepository.findByName(
      command.updateBookingDto.name,
    );
    if (!user) {
      throw new Error('User not found');
    }

    // Add your business logic for updating a booking
    // check if the time slot is available, etc.

    const { name, date, hairdresser, status } = command.updateBookingDto;
    const booking = new Booking(command.id, name, date, hairdresser, status);

    return this.bookingRepository.update(command.id, booking);
  }

  async deleteBooking(command: DeleteBookingCommand): Promise<void> {
    return this.bookingRepository.delete(command.id);
  }
}
