import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';

import { User } from '../../domain/user/user.entity';
import { UserSchema } from '../../infrastructure/mongo/users/user.schema';
import { UserRepository } from '../../infrastructure/mongo/users/user.repository';
// import { IUserRepository } from '../../domain/interfaces/user.repository.interface';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
  exports: [
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
})
export class UserModule {}
