import { Controller, Post, Body, Req, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './cqrs/dto/login.dto';
import { RegisterDto } from './cqrs/dto/register.dto';
import { Request } from 'express';
import { CreateRegisterCommand } from './cqrs/commands';
import { GetLoginQuery } from './cqrs/queries';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
  ): Promise<string> {
    const ipAddress = req.ip;
    this.logger.debug('ipAddess: ' + ipAddress);
    const query = new GetLoginQuery(loginDto, ipAddress);
    return this.authService.login(query);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const command = new CreateRegisterCommand(registerDto);
    return this.authService.register(command);
  }
}
