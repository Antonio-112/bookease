import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { BookingSchema } from '../../infrastructure/mongo/booking/booking.schema';
import { BookingRepository } from '../../infrastructure/mongo/booking/booking.repository';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Booking', schema: BookingSchema }]),
  ],
  controllers: [BookingController],
  providers: [
    BookingService,
    {
      provide: 'IBookingRepository',
      useClass: BookingRepository,
    },
    {
      provide: 'IUserRepository',
      useClass: BookingRepository,
    },
  ],
})
export class BookingModule {}
