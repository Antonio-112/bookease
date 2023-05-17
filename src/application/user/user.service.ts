import { Inject, Injectable, Logger } from '@nestjs/common';
import { IUserRepository } from '../../domain/user/interfaces/user.repository';
import { User } from '../../domain/user/user.entity';
import { CreateUserCommand } from './cqrs/commands/create-user.command';
import { GetUsersQuery } from './cqrs/queries/get-users.query';
import { GetUserQuery } from './cqrs/queries/get-user.query';
import { UpdateUserCommand } from './cqrs/commands/update-user.command';
import { DeleteUserCommand } from './cqrs/commands/delete-user.command';
import { UpdatePasswordCommand } from './cqrs/commands/update-password.command';
import { hash, compare } from 'bcrypt';
import { UserNotFoundException } from './exceptions/user-not-found.exception';
@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(@Inject('IUserRepository') private readonly userRepository: IUserRepository) {}

  async create(command: CreateUserCommand): Promise<User> {
    const { name, email, password } = command.createUserDto;

    const user = new User(null, name, email, password);

    this.logger.log(`Creating user: ${JSON.stringify(user)}`);
    return await this.userRepository.create(user);
  }

  async updatePassword(command: UpdatePasswordCommand): Promise<boolean> {
    const { id, oldPassword, newPassword } = command;
    this.logger.log(`Updating password for user ID: ${id}`);

    const user = await this.userRepository.findById(id);

    if (!user) throw new UserNotFoundException(`User with ID: ${id} not found.`);

    const isTheCorrectPass = await compare(oldPassword, user.password);
    if (!isTheCorrectPass) {
      this.logger.debug('The given password dont match the old password');
      throw new Error('The given password dont match the old password');
    }

    const isSamePassword = await compare(newPassword, user.password);

    if (isSamePassword) throw new Error('New password cannot be the same as the current password.');

    const hashedPassword = await hash(newPassword, 10);

    return await this.userRepository.updatePassword(command.id, hashedPassword);
  }

  async findAll(_query: GetUsersQuery): Promise<User[]> {
    this.logger.log('Finding all users');
    return await this.userRepository.findAll();
  }

  async findById(query: GetUserQuery): Promise<User> {
    this.logger.log(`Finding user by ID: ${query.id}`);
    return await this.userRepository.findById(query.id);
  }

  async update(command: UpdateUserCommand): Promise<User> {
    const { name, email, password } = command.updateUsergDto;
    const user = new User(command.id, name, email, password);
    return await this.userRepository.update(command.id, user);
  }

  async delete(command: DeleteUserCommand): Promise<boolean> {
    return await this.userRepository.delete(command.id);
  }
}
