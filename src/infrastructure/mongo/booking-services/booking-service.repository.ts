import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IBookingServiceRepository } from 'src/domain/booking-service/interfaces/booking-service.repository';
import { BookingServices } from 'src/domain/booking-service/booking-service.entity';

@Injectable()
export class BookingServiceRepository implements IBookingServiceRepository {
  private readonly logger = new Logger(BookingServiceRepository.name);
  constructor(@InjectModel('BookingServices') private readonly bookingServiceModel: Model<BookingServices>) {}

  private mapToBookingEntity(doc: any): BookingServices {
    return new BookingServices(doc._id ?? '', doc.name, doc.details, doc.duration, doc.price);
  }

  async create(booking: BookingServices): Promise<BookingServices> {
    this.logger.debug('Creating a booking service: ' + JSON.stringify(booking));
    const createdBooking = new this.bookingServiceModel({
      name: booking.name,
      price: booking.price,
      details: booking.details,
      duration: booking.duration,
    });

    const savedDoc = await createdBooking.save();
    this.logger.verbose(`Created booking service with id: ${savedDoc._id}`);
    return this.mapToBookingEntity(savedDoc);
  }

  async findAll(): Promise<BookingServices[]> {
    this.logger.debug('Fetching all booking services');
    const docs = await this.bookingServiceModel.find().exec();
    this.logger.verbose(`Found ${docs.length} booking services`);
    return docs.map(this.mapToBookingEntity);
  }

  async findById(id: string): Promise<BookingServices> {
    this.logger.debug(`Fetching booking service with id: ${id}`);
    const doc = await this.bookingServiceModel.findById(id).exec();
    this.logger.verbose(`Found booking service: ${JSON.stringify(doc)}`);
    return this.mapToBookingEntity(doc);
  }

  async findByName(name: string): Promise<BookingServices> {
    this.logger.debug(`Fetching booking service with name: ${name}`);
    const doc = await this.bookingServiceModel.findOne({ name: name }).exec();
    this.logger.verbose(`Found booking service: ${JSON.stringify(doc)}`);
    return this.mapToBookingEntity(doc);
  }

  async update(id: string, booking: BookingServices): Promise<BookingServices> {
    this.logger.debug(`Updating booking service with id: ${id}`);
    const doc = await this.bookingServiceModel.findByIdAndUpdate(id, booking, { new: true }).exec();
    this.logger.verbose(`Updated booking service: ${JSON.stringify(doc)}`);
    return this.mapToBookingEntity(doc);
  }

  async delete(id: string): Promise<boolean> {
    this.logger.debug(`Deleting booking service with id: ${id}`);
    const result = await this.bookingServiceModel.findByIdAndDelete(id).exec();
    if (result) {
      this.logger.verbose(`Deleted booking service with id: ${id}`);
      return true;
    } else {
      this.logger.verbose(`No booking service found with id: ${id}`);
      return false;
    }
  }
}
