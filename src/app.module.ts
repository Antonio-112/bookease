import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingModule } from './application/booking/booking.module';
import { UserModule } from './application/user/user.module';
import { AuthModule } from './application/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin:admin@cluster0.1us65oe.mongodb.net/?retryWrites=true&w=majority',
    ),
    AuthModule,
    BookingModule,
    UserModule,
  ],
})
export class AppModule {}
