import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking } from '../../../domain/booking/booking.entity';
import { IBookingRepository } from '../../../domain/booking/interfaces/booking.repository';

@Injectable()
export class BookingRepository implements IBookingRepository {
  constructor(
    @InjectModel('Booking') private readonly bookingModel: Model<Booking>,
  ) {}

  async create(booking: Booking): Promise<Booking> {
    const createdBooking = new this.bookingModel(booking);
    return await createdBooking.save();
  }

  async findAll(): Promise<Booking[]> {
    return await this.bookingModel.find().exec();
  }

  async findById(id: string): Promise<Booking> {
    return await this.bookingModel.findById(id).exec();
  }

  async findByName(name: string): Promise<Booking> {
    return await this.bookingModel.findOne({ name }).exec();
  }

  async update(id: string, booking: Booking): Promise<Booking> {
    return await this.bookingModel
      .findByIdAndUpdate(id, booking, { new: true })
      .exec();
  }

  async delete(id: string): Promise<void> {
    await this.bookingModel.findByIdAndDelete(id).exec();
  }

  async findByHairdresserAndTimeRange(
    hairdresser: string,
    startTime: Date,
    endTime: Date,
  ): Promise<Booking[]> {
    return await this.bookingModel
      .find({
        hairdresser,
        date: {
          $gte: startTime,
          $lt: endTime,
        },
      })
      .exec();
  }
}
