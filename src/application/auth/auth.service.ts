import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUserRepository } from '../../domain/user/interfaces/user.repository';
import { LoginDto } from './cqrs/dto/login.dto';
import { RegisterDto } from './cqrs/dto/register.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../../domain/user/user.entity';
import { LoginAttempt } from 'src/domain/login-attempt/login-attempt.entity';
import { ILoginAttemptRepository } from 'src/domain/login-attempt/login-attempt.repository';

@Injectable()
export class AuthService {
  private readonly MAX_FAILED_ATTEMPTS = 5;
  private readonly BLOCK_DURATION_MINUTES = 15;
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('ILoginAttemptRepository')
    private readonly loginAttemptRepository: ILoginAttemptRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto, ipAddress: string) {
    const user = await this.userRepository.findByEmail(loginDto.email);

    if (!user) {
      throw new Error('User not found');
    }

    // Check for failed login attempts
    const failedAttemptsByEmail =
      await this.loginAttemptRepository.countRecentAttemptsByEmail(
        loginDto.email,
        this.BLOCK_DURATION_MINUTES,
      );
    const failedAttemptsByIpAddress =
      await this.loginAttemptRepository.countRecentAttemptsByIpAddress(
        ipAddress,
        this.BLOCK_DURATION_MINUTES,
      );

    if (
      failedAttemptsByEmail >= this.MAX_FAILED_ATTEMPTS ||
      failedAttemptsByIpAddress >= this.MAX_FAILED_ATTEMPTS
    ) {
      throw new HttpException(
        'Too many failed login attempts. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Verify password using bcrypt
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      // Add a failed login attempt
      await this.loginAttemptRepository.create(
        new LoginAttempt(null, loginDto.email, ipAddress, new Date()),
      );
      throw new Error('Invalid password');
    }

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(
      registerDto.email,
    );

    if (existingUser) {
      throw new Error('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = new User(
      null,
      registerDto.name,
      registerDto.email,
      hashedPassword,
    );

    return this.userRepository.create(user);
  }
}
