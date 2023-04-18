import { Inject, Injectable, Logger } from '@nestjs/common';
import { Booking } from '../../domain/booking/booking.entity';
import { CreateBookingCommand } from './cqrs/commands/create-booking.command';
import { UpdateBookingCommand } from './cqrs/commands/update-booking.command';
import { DeleteBookingCommand } from './cqrs/commands/delete-booking.command';
import { IBookingRepository } from 'src/domain/booking/interfaces/booking.repository';
import { IUserRepository } from '../../domain/user/interfaces/user.repository';
import { GetBookingQuery } from './cqrs/queries/get-booking.query';
import { GetBookingsQuery } from './cqrs/queries/get-bookings.query';

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);
  constructor(
    @Inject('IBookingRepository')
    private readonly bookingRepository: IBookingRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async isTimeSlotAvailable(date: Date, hairdresser: string): Promise<boolean> {
    this.logger.debug(
      `Checking time slot availability for ${hairdresser} on ${date}`,
    );
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
    this.logger.debug(
      `Creating a booking with data: ${JSON.stringify(
        command.createBookingDto,
      )}`,
    );
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
    this.logger.debug('Fetching all bookings');
    return this.bookingRepository.findAll();
  }

  async getBooking(query: GetBookingQuery): Promise<Booking> {
    this.logger.debug(`Fetching booking with ID: ${query.id}`);
    return this.bookingRepository.findById(query.id);
  }

  async updateBooking(command: UpdateBookingCommand): Promise<Booking> {
    this.logger.debug(
      `Updating booking with ID: ${command.id} and data: ${JSON.stringify(
        command.updateBookingDto,
      )}`,
    );
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
    this.logger.debug(`Deleting booking with ID: ${command.id}`);
    return this.bookingRepository.delete(command.id);
  }
}
