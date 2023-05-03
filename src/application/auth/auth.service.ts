import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUserRepository } from '../../domain/user/interfaces/user.repository';
import * as bcrypt from 'bcrypt';
import { User } from '../../domain/user/user.entity';
import { LoginAttempt } from '../../domain/login-attempt/login-attempt.entity';
import { ILoginAttemptRepository } from '../../domain/login-attempt/interfaces/login-attempt.repository';
import { CreateRegisterCommand } from './cqrs/commands';
import { GetLoginQuery } from './cqrs/queries';

@Injectable()
export class AuthService {
  private readonly logger: Logger;
  private readonly MAX_FAILED_ATTEMPTS = 5;
  private readonly BLOCK_DURATION_MINUTES = 15;

  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('ILoginAttemptRepository')
    private readonly loginAttemptRepository: ILoginAttemptRepository,
    private readonly jwtService: JwtService,
  ) {
    this.logger = new Logger(AuthService.name);
  }

  async login(query: GetLoginQuery): Promise<string> {
    const { email, password } = query.loginDto;
    // Log the attempt to login
    this.logger.debug('Attempting to log in with email: ' + email);

    // Find the user by email
    const user = await this.userRepository.findByEmail(email);

    // If user is not found, return an error message
    if (!user) {
      this.logger.debug('User not found for email: ' + email);
      return 'User not found';
    }

    // Check for failed login attempts by email and IP address
    const failedAttemptsByEmail =
      await this.loginAttemptRepository.countRecentAttemptsByEmail(
        email,
        this.BLOCK_DURATION_MINUTES,
      );
    const failedAttemptsByIpAddress =
      await this.loginAttemptRepository.countRecentAttemptsByIpAddress(
        query.ip,
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
      this.logger.warn('Too many failed login attempts for email: ' + email);
      throw new HttpException(
        'Too many failed login attempts. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Verify the password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If the password is invalid, add a failed login attempt and return an error message
    if (!isPasswordValid) {
      await this.loginAttemptRepository.create(
        new LoginAttempt(null, email, query.ip, new Date()),
      );
      this.logger.debug('Invalid password for email: ' + email);
      return 'Invalid password';
    }

    // If login is successful, create the JWT payload and sign the token
    const payload = { sub: user.id, email: user.email };
    this.logger.debug('Login successful for email: ' + email);
    return JSON.stringify({
      access_token: this.jwtService.sign(payload),
    });
  }

  async register(command: CreateRegisterCommand): Promise<User> {
    const { email, name, password } = command.registerDto;
    this.logger.debug('Attempting to register with email: ' + email);

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) throw new Error('Email already in use');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User(null, name, email, hashedPassword);

    return this.userRepository.create(user);
  }
}
