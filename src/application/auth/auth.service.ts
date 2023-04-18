import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
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
  private logger = new Logger(AuthService.name);
  private readonly MAX_FAILED_ATTEMPTS = 5;
  private readonly BLOCK_DURATION_MINUTES = 15;
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('ILoginAttemptRepository')
    private readonly loginAttemptRepository: ILoginAttemptRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto, ipAddress: string): Promise<string> {
    // Log the attempt to login
    this.logger.debug('Attempting to log in with email: ' + loginDto.email);

    // Find the user by email
    const user = await this.userRepository.findByEmail(loginDto.email);

    // If user is not found, return an error message
    if (!user) {
      this.logger.debug('User not found for email: ' + loginDto.email);
      return 'User not found';
    }

    // Check for failed login attempts by email and IP address
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
    this.logger.log('Failed login attemps by email: ' + failedAttemptsByEmail);
    this.logger.log(
      'Failed attempts by ip address: ' + failedAttemptsByIpAddress,
    );
    // If there are too many failed attempts, return an error message
    if (
      failedAttemptsByEmail >= this.MAX_FAILED_ATTEMPTS ||
      failedAttemptsByIpAddress >= this.MAX_FAILED_ATTEMPTS
    ) {
      this.logger.warn(
        'Too many failed login attempts for email: ' + loginDto.email,
      );
      throw new HttpException(
        'Too many failed login attempts. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Verify the password using bcrypt
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    // If the password is invalid, add a failed login attempt and return an error message
    if (!isPasswordValid) {
      await this.loginAttemptRepository.create(
        new LoginAttempt(null, loginDto.email, ipAddress, new Date()),
      );
      this.logger.debug('Invalid password for email: ' + loginDto.email);
      return 'Invalid password';
    }

    // If login is successful, create the JWT payload and sign the token
    const payload = { sub: user.id, email: user.email };
    this.logger.debug('Login successful for email: ' + loginDto.email);
    return JSON.stringify({
      access_token: this.jwtService.sign(payload),
    });
  }

  async register(registerDto: RegisterDto): Promise<User> {
    this.logger.debug(
      'Attempting to register with email: ' + registerDto.email,
    );
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
