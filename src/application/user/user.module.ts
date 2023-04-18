import { Module, Provider } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

import { MongoModule } from 'src/infrastructure/mongo/mongo.module';
// import { IUserRepository } from '../../domain/interfaces/user.repository.interface';

const provider: Provider[] = [UserService];
@Module({
  imports: [MongoModule],
  controllers: [UserController],
  providers: [...provider],
  exports: [...provider],
})
export class UserModule {}
