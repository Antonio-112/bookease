import { Module, Provider } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { BookingServiceController } from './booking-services.controller';
import { BookingServicesService } from './booking-services.service';
import { MongoModule } from '../../infrastructure/mongo/mongo.module';

const provider: Provider[] = [BookingServicesService];
@Module({
  imports: [MongoModule],
  controllers: [BookingServiceController],
  providers: [
    ...provider,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [...provider],
})
export class BookingServiceModule {}
