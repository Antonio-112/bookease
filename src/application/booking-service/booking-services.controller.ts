import { Controller, Get, Post, Body, Param, Put, Delete, Logger } from '@nestjs/common';
import { BookingServicesService } from './booking-services.service';
import {
  CreateBookingServiceCommand,
  DeleteBookingServiceCommand,
  GetBookingServiceQuery,
  GetBookingServicesQuery,
  UpdateBookingServiceCommand,
} from './cqrs';
import { CreateBookingServiceDto } from './cqrs/dtos/create-booking-service.dto';
import { UpdateBookingServiceDto } from './cqrs/dtos/update-booking-service.dto';
import { BookingServices } from '../../domain/booking-service/booking-service.entity';

@Controller('booking-service')
export class BookingServiceController {
  private readonly logger = new Logger(BookingServiceController.name);

  constructor(private readonly bookingService: BookingServicesService) {}

  @Post()
  async create(@Body() BookingService: CreateBookingServiceDto): Promise<BookingServices> {
    this.logger.log(`Creating a new booking service with data: ${JSON.stringify(BookingService)}`);
    const command = new CreateBookingServiceCommand(BookingService);
    return this.bookingService.create(command);
  }

  @Get()
  async findAll(): Promise<BookingServices[]> {
    this.logger.log('Getting all booking services');
    const query = new GetBookingServicesQuery();
    return this.bookingService.findAll(query);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<BookingServices> {
    this.logger.log(`Getting booking service by id: ${id}`);
    const query = new GetBookingServiceQuery(id);
    return this.bookingService.findById(query);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() bookingService: UpdateBookingServiceDto,
  ): Promise<BookingServices> {
    this.logger.log(
      `Updating booking service with id: ${id} with data: ${JSON.stringify(bookingService)}`,
    );
    const command = new UpdateBookingServiceCommand(id, bookingService);
    return this.bookingService.update(command);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<boolean> {
    this.logger.log(`Deleting booking service with id: ${id}`);
    const command = new DeleteBookingServiceCommand(id);
    return this.bookingService.delete(command);
  }
}
