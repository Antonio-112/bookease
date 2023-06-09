import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { BookingService } from '../booking-services/booking-service.schema';

export type BookingDocument = Booking & Document;

@Schema()
export class Booking {
  @Prop({ type: String, auto: true })
  id: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: String, required: true })
  hairdresser: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: BookingService.name }], required: true })
  service: Types.ObjectId[];

  @Prop({ type: String, required: true, enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'] })
  status: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Number, required: true })
  duration: number;

  @Prop({ type: String, default: '' })
  note: string;

  @Prop({ type: String, required: true })
  phoneNumber: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

export const BookingModel = mongoose.model<BookingDocument>('Booking', BookingSchema);
