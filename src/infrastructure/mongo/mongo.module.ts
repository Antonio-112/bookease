import { Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { User } from '../../domain/user/user.entity';
import { UserSchema } from './users/user.schema';
import { UserRepository } from './users/user.repository';
import { LoginAttemptRepository } from './login-attempt/login-attempt.repository';
import { LoginAttemptSchema } from './login-attempt/login-attempt.schema';
import { LoginAttempt } from '../../domain/login-attempt/login-attempt.entity';
import { BookingRepository } from './booking/booking.repository';
import { Booking } from '../../domain/booking/booking.entity';
import { BookingSchema } from './booking/booking.schema';
import { BookingServiceSchema } from './booking-services/booking-service.schema';
import { BookingServiceRepository } from './booking-services/booking-service.repository';
import { BookingServices } from 'src/domain/booking-service/booking-service.entity';

const mongoProviders: Provider[] = [
  {
    provide: 'IUserRepository',
    useClass: UserRepository,
  },
  {
    provide: 'ILoginAttemptRepository',
    useClass: LoginAttemptRepository,
  },
  {
    provide: 'IBookingRepository',
    useClass: BookingRepository,
  },
  {
    provide: 'IBookingServiceRepository',
    useClass: BookingServiceRepository,
  },
];

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('DATABASE_URL'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: LoginAttempt.name, schema: LoginAttemptSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: BookingServices.name, schema: BookingServiceSchema },
    ]),
  ],
  controllers: [],
  providers: [...mongoProviders],
  exports: [...mongoProviders],
})
export class MongoModule {}
