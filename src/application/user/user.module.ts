import { Module, Provider, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

import { MongoModule } from 'src/infrastructure/mongo/mongo.module';
import { AuthModule } from '../auth/auth.module';
// import { IUserRepository } from '../../domain/interfaces/user.repository.interface';

const provider: Provider[] = [UserService];
@Module({
  imports: [MongoModule, forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [...provider],
  exports: [...provider],
})
export class UserModule {}
