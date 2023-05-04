import { Controller, Get, Post, Body, Param, Put, Delete, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../../domain/user/user.entity';
import { GetUserQuery, GetUsersQuery } from './cqrs/queries';
import { CreateUserDto, UpdatePasswordDto, UpdateUserDto } from './cqrs/dtos';
import { CreateUserCommand, DeleteUserCommand, UpdatePasswordCommand, UpdateUserCommand } from './cqrs/commands';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

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
  async update(@Param('id') id: string, @Body() user: UpdateUserDto): Promise<User> {
    const command = new UpdateUserCommand(id, user);
    return this.userService.update(command);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<boolean> {
    const command = new DeleteUserCommand(id);
    return this.userService.delete(command);
  }

  @Patch('password/:id')
  @UseGuards(JwtAuthGuard)
  async updatePassword(@Param('id') id: string, @Body() updatePasswordDto: UpdatePasswordDto): Promise<boolean> {
    const { oldPassword, newPassword } = updatePasswordDto;
    const command = new UpdatePasswordCommand(id, newPassword, oldPassword);
    return this.userService.updatePassword(command);
  }
}
