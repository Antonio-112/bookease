import { Inject, Injectable, Logger } from '@nestjs/common';
import { Booking } from '../../domain/booking/booking.entity';
import { CreateBookingCommand } from './cqrs/commands/create-booking.command';
import { UpdateBookingCommand } from './cqrs/commands/update-booking.command';
import { DeleteBookingCommand } from './cqrs/commands/delete-booking.command';
import { IBookingRepository } from '../../domain/booking/interfaces/booking.repository';
import { IUserRepository } from '../../domain/user/interfaces/user.repository';
import { GetBookingQuery } from './cqrs/queries/get-booking.query';
import { GetBookingsQuery } from './cqrs/queries/get-bookings.query';
import { GetBookingByTimeRangeQuery } from './cqrs/queries/get-booking-by-time-range.query';
import { GetBookingByStatusQuery } from './cqrs/queries/get-booking-by-status.query';
import { UpdateBookingStatusCommand } from './cqrs/commands/update-booking-status.command';
// import { BookingServices } from '../../domain/booking-service/booking-service.entity';
import { ConfigService } from '@nestjs/config';
import { IBookingServiceRepository } from '../../domain/booking-service/interfaces/booking-service.repository';

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);
  private readonly startTime: number;
  private readonly endTime: number;
  private readonly timeInterval: number;
  constructor(
    @Inject('IBookingRepository')
    private readonly bookingRepository: IBookingRepository,
    @Inject('IBookingServiceRepository')
    private readonly bookingServiceRepo: IBookingServiceRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly configService: ConfigService,
  ) {
    this.startTime = Number(this.configService.get('ATTENTION_START_TIME'));
    this.endTime = Number(this.configService.get('ATTENTION_END_TIME'));
    this.timeInterval = Number(this.configService.get('ATTENTION_INTERVAL'));
  }

  async isTimeSlotAvailable(date: Date, hairdresser: string): Promise<boolean> {
    const selectedDate = new Date(date);
    const selectedHour = selectedDate.getHours();

    this.logger.verbose('Checking if time slot is available');
    this.logger.debug(`Input date: ${date}, hairdresser: ${hairdresser}`);

    if (selectedHour < this.startTime || selectedHour >= this.endTime) {
      this.logger.log('Time slot is outside business hours');
      return false;
    }

    this.logger.verbose('Iterating through time slots');
    for (let time = this.startTime; time < this.endTime; time += this.timeInterval) {
      const nextTime = time + this.timeInterval;
      this.logger.debug(`Current time slot: ${time}, next time slot: ${nextTime}`);

      if (selectedHour >= time && selectedHour < nextTime) {
        this.logger.debug('Selected hour is within the current time slot');
        const startDateTime = new Date(selectedDate);
        startDateTime.setHours(time, 0, 0, 0);
        const endDateTime = new Date(selectedDate);
        endDateTime.setHours(nextTime, 0, 0, 0);
        this.logger.debug(`Checking time range: ${startDateTime} - ${endDateTime}`);

        const bookings = await this.bookingRepository.findByHairdresserAndTimeRange(
          hairdresser,
          startDateTime,
          endDateTime,
        );
        this.logger.debug(`Number of bookings found: ${bookings.length}`);

        if (bookings.length === 0) {
          this.logger.log('Time slot is available');
        } else {
          this.logger.log('Time slot is not available');
        }

        return bookings.length === 0;
      }
    }

    this.logger.verbose('No matching time slot found');
    return false;
  }

  async calculatePriceAndDuration(services: string[]): Promise<{ price: number; duration: number }> {
    const data = {
      price: 0,
      duration: 0,
    };

    for (let i = 0; i < services.length; i++) {
      this.logger.debug(`Processing service with id: ${services[i]}`);
      const service = await this.bookingServiceRepo.findById(services[i]);

      if (!service) {
        this.logger.warn(`Service with id ${services[i]} not found`);
        continue;
      }

      this.logger.verbose(`Service duration: ${service.duration}, service price: ${service.price}`);
      data.duration += Number(service.duration);
      data.price += Number(service.price);
    }

    this.logger.verbose(`Calculated total duration: ${data.duration}, total price: ${data.price}`);
    return data;
  }

  async createBooking(command: CreateBookingCommand): Promise<Booking> {
    const { name, date, hairdresser, status, note, phoneNumber, service } = command.createBookingDto;

    const user = await this.userRepository.findByName(name);
    if (!user) {
      throw new Error('User not found');
    }

    if (!(await this.isTimeSlotAvailable(date, hairdresser))) {
      throw new Error('Time slot is not available');
    }

    const { price, duration } = await this.calculatePriceAndDuration(service);

    this.logger.debug(`Calculated price: ${price}, duration: ${duration}`);

    const booking = new Booking(null, name, date, hairdresser, status, service, price, duration, note, phoneNumber);

    this.logger.debug(`Creating a booking with data: ${JSON.stringify(command.createBookingDto)}`);
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
    this.logger.debug(`Updating booking with ID: ${command.id} and data: ${JSON.stringify(command.updateBookingDto)}`);

    const { name, date, hairdresser, status, duration, note, phoneNumber, price, service } = command.updateBookingDto;
    const user = await this.userRepository.findByName(command.updateBookingDto.name);
    if (!user) throw new Error('User not found');
    if (!(await this.isTimeSlotAvailable(date, hairdresser))) throw new Error('Time slot is not available');

    const booking = new Booking(
      command.id,
      name,
      date,
      hairdresser,
      status,
      service,
      price,
      duration,
      note,
      phoneNumber,
    );

    return this.bookingRepository.update(command.id, booking);
  }

  async deleteBooking(command: DeleteBookingCommand): Promise<void> {
    this.logger.debug(`Deleting booking with ID: ${command.id}`);
    return this.bookingRepository.delete(command.id);
  }
  async updateBookingStatus(command: UpdateBookingStatusCommand): Promise<Booking> {
    this.logger.debug(`Updating booking with ID: ${command.id} to status: ${command.status.status}`);
    return this.bookingRepository.updateStatus(command.id, command.status.status);
  }

  async findByTimeRange(query: GetBookingByTimeRangeQuery): Promise<Booking[]> {
    return this.bookingRepository.findByTimeRange(query.startTime, query.endTime);
  }
  async findByStatus(query: GetBookingByStatusQuery): Promise<Booking[]> {
    return this.bookingRepository.findByStatus(query.status);
  }
}
