import { Inject, Injectable, Logger } from '@nestjs/common';
import { IUserRepository } from '../../domain/user/interfaces/user.repository';
import { User } from 'src/domain/user/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async create(user: User): Promise<User> {
    this.logger.log(`Creating user: ${JSON.stringify(user)}`);
    const result = await this.userRepository.create(user);
    this.logger.log(`User created: ${JSON.stringify(result)}`);
    return result;
  }

  async findAll(): Promise<User[]> {
    this.logger.log('Finding all users');
    const result = await this.userRepository.findAll();
    this.logger.log(`Found ${result.length} users`);
    return result;
  }

  async findById(id: string): Promise<User> {
    this.logger.log(`Finding user by ID: ${id}`);
    const result = await this.userRepository.findById(id);
    this.logger.log(`User found: ${JSON.stringify(result)}`);
    return result;
  }

  async update(id: string, user: User): Promise<User> {
    this.logger.log(
      `Updating user with ID: ${id}, data: ${JSON.stringify(user)}`,
    );
    const result = await this.userRepository.update(id, user);
    this.logger.log(`User updated: ${JSON.stringify(result)}`);
    return result;
  }

  async delete(id: string): Promise<boolean> {
    this.logger.log(`Deleting user with ID: ${id}`);
    const result = await this.userRepository.delete(id);
    this.logger.log(`User deleted: ${result}`);
    return result;
  }
}
