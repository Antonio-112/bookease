import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Patch,
  UseGuards,
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
import { UpdatePasswordCommand } from './cqrs/commands/update-password.command';
import { UpdatePasswordDto } from './cqrs/dtos/update-password.dto';
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

  @Patch('password/:id')
  // Verificar que el usuario este logeado con el token jwt
  @UseGuards(JwtAuthGuard)
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<boolean> {
    const { oldPassword, newPassword } = updatePasswordDto;
    const command = new UpdatePasswordCommand(id, newPassword, oldPassword);
    return this.userService.updatePassword(command);
  }
}
