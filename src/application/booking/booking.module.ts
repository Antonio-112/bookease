import { Module, Provider } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { MongoModule } from 'src/infrastructure/mongo/mongo.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

const providers: Provider[] = [BookingService];

@Module({
  imports: [MongoModule],
  controllers: [BookingController],
  providers: [
    ...providers,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [...providers],
})
export class BookingModule {}
