import { Module, Provider, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

import { MongoModule } from 'src/infrastructure/mongo/mongo.module';
import { AuthModule } from '../auth/auth.module';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

const provider: Provider[] = [UserService];
@Module({
  imports: [MongoModule, forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [
    ...provider,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [...provider],
})
export class UserModule {}
