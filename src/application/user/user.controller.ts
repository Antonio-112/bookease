import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../../domain/user/user.entity';
import { GetUserQuery } from './cqrs/queries/get-user.query';
import { UpdateUserDto } from './cqrs/dtos/update-user.dto';
import { GetUsersQuery } from './cqrs/queries/get-users.query';
import { CreateUserDto } from './cqrs/dtos/create-user.dto';
import { CreateUserCommand } from './cqrs/commands/create-user.command';
import { UpdateUserCommand } from './cqrs/commands/update-user.command';
import { DeleteUserCommand } from './cqrs/commands/delete-user.command';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() user: CreateUserDto): Promise<User> {
    const command = new CreateUserCommand(user);
    return this.userService.create(command);
  }

  @Get()
  async findAll(): Promise<User[]> {
    const query = new GetUsersQuery();
    return this.userService.findAll(query);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<User> {
    const query = new GetUserQuery(id);
    return this.userService.findById(query);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() user: UpdateUserDto,
  ): Promise<User> {
    const command = new UpdateUserCommand(id, user);
    return this.userService.update(command);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<boolean> {
    const command = new DeleteUserCommand(id);
    return this.userService.delete(command);
  }
}
