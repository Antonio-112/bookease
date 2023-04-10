import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IBookingRepository } from '../../../domain/interfaces/booking.repository.interface';
import { Booking } from '../../../domain/booking/booking.entity';
// import { BookingSchema } from './booking.schema';

@Injectable()
export class BookingRepository implements IBookingRepository {
  constructor(
    @InjectModel('Booking') private readonly bookingModel: Model<Booking>,
  ) {}

  async create(booking: Booking): Promise<Booking> {
    const newBooking = new this.bookingModel(booking);
    return newBooking.save();
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingModel.find().exec();
  }

  async findById(id: string): Promise<Booking> {
    return this.bookingModel.findById(id).exec();
  }

  async update(id: string, booking: Booking): Promise<Booking> {
    return this.bookingModel
      .findByIdAndUpdate(id, booking, { new: true })
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    return this.bookingModel
      .findByIdAndDelete(id)
      .exec()
      .then(() => true);
  }
}
