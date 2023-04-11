import { Inject, Injectable } from '@nestjs/common';
import { Booking } from '../../domain/booking/booking.entity';
import { IBookingRepository } from '../../domain/interfaces/booking.repository.interface';

@Injectable()
export class BookingService {
  constructor(
    @Inject('IBookingRepository')
    private readonly bookingRepository: IBookingRepository,
  ) {}

  async create(booking: Booking): Promise<Booking> {
    return this.bookingRepository.create(booking);
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingRepository.findAll();
  }

  async findById(id: string): Promise<Booking> {
    return this.bookingRepository.findById(id);
  }

  async update(id: string, booking: Booking): Promise<Booking> {
    return this.bookingRepository.update(id, booking);
  }

  async delete(id: string): Promise<boolean> {
    return this.bookingRepository.delete(id);
  }
}
