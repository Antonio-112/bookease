import { Inject, Injectable, Logger } from '@nestjs/common';
import { IBookingServiceRepository } from '../../domain/booking-service/interfaces/booking-service.repository';
import {
  CreateBookingServiceCommand,
  DeleteBookingServiceCommand,
  GetBookingServiceQuery,
  GetBookingServicesQuery,
  UpdateBookingServiceCommand,
} from './cqrs';
import { BookingServices } from '../../domain/booking-service/booking-service.entity';
@Injectable()
export class BookingServicesService {
  private readonly logger = new Logger(BookingServicesService.name);

  constructor(
    @Inject('IBookingServiceRepository')
    private readonly bookingServiceRepository: IBookingServiceRepository,
  ) {}

  async create(command: CreateBookingServiceCommand): Promise<BookingServices> {
    const { name, details, duration, price } = command.createBookingService;

    const bookingService = new BookingServices(null, name, details, duration, price);
    this.logger.log(`Creating BookingService: ${JSON.stringify(bookingService)}`);
    return await this.bookingServiceRepository.create(bookingService);
  }

  async findAll(_query: GetBookingServicesQuery): Promise<BookingServices[]> {
    this.logger.log('Finding all BookingServices' + _query);
    return await this.bookingServiceRepository.findAll();
  }

  async findById(query: GetBookingServiceQuery): Promise<BookingServices> {
    this.logger.log(`Finding BookingService by ID: ${query.id}`);
    return await this.bookingServiceRepository.findById(query.id);
  }

  async update(command: UpdateBookingServiceCommand): Promise<BookingServices> {
    const { name, details, duration, price } = command.updateBookingService;
    const bookingService = new BookingServices(command.id, name, details, duration, price);
    return await this.bookingServiceRepository.update(command.id, bookingService);
  }

  async delete(command: DeleteBookingServiceCommand): Promise<boolean> {
    return await this.bookingServiceRepository.delete(command.id);
  }
}
