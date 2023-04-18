import { Module } from '@nestjs/common';
import { BookingModule } from './application/booking/booking.module';
import { UserModule } from './application/user/user.module';
import { AuthModule } from './application/auth/auth.module';
import { MongoModule } from './infrastructure/mongo/mongo.module';

@Module({
  imports: [MongoModule, AuthModule, BookingModule, UserModule],
})
export class AppModule {}
