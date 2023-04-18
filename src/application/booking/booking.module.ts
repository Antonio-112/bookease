import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { MongoModule } from 'src/infrastructure/mongo/mongo.module';

@Module({
  imports: [MongoModule],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
