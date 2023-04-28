import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Logger,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './cqrs/dtos/create-booking.dto';
import { UpdateBookingDto } from './cqrs/dtos/update-booking.dto';
import { CreateBookingCommand } from './cqrs/commands/create-booking.command';
import { UpdateBookingCommand } from './cqrs/commands/update-booking.command';
import { DeleteBookingCommand } from './cqrs/commands/delete-booking.command';
import { GetBookingQuery } from './cqrs/queries/get-booking.query';
import { GetBookingsQuery } from './cqrs/queries/get-bookings.query';
import { GetBookingByStatusQuery } from './cqrs/queries/get-booking-by-status.query';
import { UpdateBookingStatusDto } from './cqrs/dtos/update-booking-status.dto';
import { UpdateBookingStatusCommand } from './cqrs/commands/update-booking-status.command';

@Controller('booking')
export class BookingController {
  private readonly logger = new Logger(BookingController.name);

  constructor(private readonly bookingService: BookingService) {}

  @Post()
  async createBooking(@Body() createBookingDto: CreateBookingDto) {
    this.logger.log('Creating a booking');
    const command = new CreateBookingCommand(createBookingDto);
    return await this.bookingService.createBooking(command);
  }

  @Get()
  async getBookings() {
    this.logger.log('Getting all bookings');
    const query = new GetBookingsQuery();
    return await this.bookingService.getBookings(query);
  }

  @Get(':id')
  async getBooking(@Param('id') id: string) {
    this.logger.log(`Getting booking with id ${id}`);
    const query = new GetBookingQuery(id);
    return await this.bookingService.getBooking(query);
  }

  @Get('status/:status')
  async getBookingByStatus(@Param('status') status: string) {
    const query = new GetBookingByStatusQuery(status);
    return await this.bookingService.findByStatus(query);
  }

  @Put(':id')
  async updateBooking(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    this.logger.log(`Updating booking with id ${id}`);
    const command = new UpdateBookingCommand(id, updateBookingDto);
    return await this.bookingService.updateBooking(command);
  }

  @Put(':id/status')
  async updateBookingStatus(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingStatusDto,
  ) {
    this.logger.log(`Updating booking with id ${id}`);
    const command = new UpdateBookingStatusCommand(id, updateBookingDto);
    return await this.bookingService.updateBookingStatus(command);
  }

  @Delete(':id')
  async deleteBooking(@Param('id') id: string) {
    this.logger.log(`Deleting booking with id ${id}`);
    const command = new DeleteBookingCommand(id);
    return await this.bookingService.deleteBooking(command);
  }
}
