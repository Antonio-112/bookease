import { Controller, Post, Body, Req, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './cqrs/dto/login.dto';
import { RegisterDto } from './cqrs/dto/register.dto';
import { Request } from 'express';

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
    return this.authService.login(loginDto, ipAddress);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
