import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingStatus } from '../../../domain/booking/booking.entity';
import { IBookingRepository } from '../../../domain/booking/interfaces/booking.repository';

@Injectable()
export class BookingRepository implements IBookingRepository {
  private readonly logger = new Logger(BookingRepository.name);
  constructor(
    @InjectModel('Booking') private readonly bookingModel: Model<Booking>,
  ) {}

  private mapToBookingEntity(doc: any): Booking {
    return new Booking(
      doc._id,
      doc.name,
      doc.date,
      doc.hairdresser,
      doc.status,
    );
  }

  async create(booking: Booking): Promise<Booking> {
    this.logger.debug('Creating a booking: ' + JSON.stringify(booking));
    const createdBooking = new this.bookingModel({
      name: booking.name,
      date: booking.date,
      hairdresser: booking.hairdresser,
      status: booking.status,
    });
    const savedDoc = await createdBooking.save();
    return this.mapToBookingEntity(savedDoc);
  }

  async findAll(): Promise<Booking[]> {
    const docs = await this.bookingModel.find().exec();
    return docs.map(this.mapToBookingEntity);
  }

  async findById(id: string): Promise<Booking> {
    const doc = await this.bookingModel.findById(id).exec();
    return this.mapToBookingEntity(doc);
  }

  async findByName(name: string): Promise<Booking> {
    const doc = await this.bookingModel.findOne({ _name: name }).exec();
    return this.mapToBookingEntity(doc);
  }

  async update(id: string, booking: Booking): Promise<Booking> {
    const doc = await this.bookingModel
      .findByIdAndUpdate(id, booking, { new: true })
      .exec();
    return this.mapToBookingEntity(doc);
  }

  async delete(id: string): Promise<void> {
    await this.bookingModel.findByIdAndDelete(id).exec();
  }

  async findByHairdresserAndTimeRange(
    hairdresser: string,
    startTime: Date,
    endTime: Date,
  ): Promise<Booking[]> {
    const docs = await this.bookingModel
      .find({
        hairdresser: hairdresser,
        date: {
          $gte: startTime,
          $lt: endTime,
        },
      })
      .exec();
    return docs.map(this.mapToBookingEntity);
  }

  // Encuentra citas según el estado (por ejemplo, "confirmed", "pending", "cancelled")
  async findByStatus(status: string): Promise<Booking[]> {
    const docs = await this.bookingModel.find({ status }).exec();
    return docs.map(this.mapToBookingEntity);
  }

  // Encuentra citas en un intervalo de tiempo específico sin importar el peluquero
  async findByTimeRange(startTime: Date, endTime: Date): Promise<Booking[]> {
    const docs = await this.bookingModel
      .find({
        date: {
          $gte: startTime,
          $lt: endTime,
        },
      })
      .exec();
    return docs.map(this.mapToBookingEntity);
  }

  // Cancela una cita si no ha comenzado y no ha sido cancelada previamente
  /* async cancelBooking(id: string): Promise<Booking> {
    const booking = await this.findById(id);

    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new Error('Booking already cancelled');
    }

    if (new Date() >= booking.date) {
      throw new Error('Cannot cancel a booking that has already started');
    }

    booking.status = BookingStatus.CANCELLED;
    return this.update(id, booking);
  } */
}
