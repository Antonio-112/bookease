import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingModule } from './application/booking/booking.module';
import { UserModule } from './application/user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin:admin@cluster0.1us65oe.mongodb.net/?retryWrites=true&w=majority',
    ),
    BookingModule,
    UserModule,
  ],
})
export class AppModule {}
