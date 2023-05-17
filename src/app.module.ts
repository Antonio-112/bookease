import { Module } from '@nestjs/common';
import { BookingModule } from './application/booking/booking.module';
import { UserModule } from './application/user/user.module';
import { AuthModule } from './application/auth/auth.module';
import { MongoModule } from './infrastructure/mongo/mongo.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { BookingServiceModule } from './application/booking-service/booking-services.module';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get('THROTTLE_TTL'),
        limit: config.get('THROTTLE_LIMIT'),
      }),
    }),
    ConfigModule.forRoot({
      ignoreEnvFile: false,
      isGlobal: true,
      cache: true,
    }),
    MongoModule,
    AuthModule,
    BookingModule,
    BookingServiceModule,
    UserModule,
  ],
})
export class AppModule {}
