import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Booking } from '../../domain/booking/booking.entity';
import { BookingService } from './booking.service';

@Controller('booking')
export class BookingController {
  private readonly logger = new Logger(BookingController.name);

  constructor(private readonly bookingService: BookingService) {}

  @Post()
  async create(@Body() booking: Booking): Promise<Booking> {
    this.logger.log(`Creating booking: ${JSON.stringify(booking)}`);
    const result = await this.bookingService.create(booking);
    this.logger.log(`Booking created: ${JSON.stringify(result)}`);
    return result;
  }

  @Get()
  async findAll(): Promise<Booking[]> {
    this.logger.log('Finding all bookings');
    const result = await this.bookingService.findAll();
    this.logger.log(`Found ${result.length} bookings`);
    return result;
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Booking> {
    this.logger.log(`Finding booking by ID: ${id}`);
    const result = await this.bookingService.findById(id);
    this.logger.log(`Booking found: ${JSON.stringify(result)}`);
    return result;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() booking: Booking,
  ): Promise<Booking> {
    this.logger.log(
      `Updating booking with ID: ${id}, data: ${JSON.stringify(booking)}`,
    );
    const result = await this.bookingService.update(id, booking);
    this.logger.log(`Booking updated: ${JSON.stringify(result)}`);
    return result;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<boolean> {
    this.logger.log(`Deleting booking with ID: ${id}`);
    const result = await this.bookingService.delete(id);
    this.logger.log(`Booking deleted: ${result}`);
    return result;
  }
}
