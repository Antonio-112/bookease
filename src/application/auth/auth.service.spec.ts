import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { IUserRepository } from '../../domain/user/interfaces/user.repository';
import { ILoginAttemptRepository } from '../../domain/login-attempt/login-attempt.repository';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../domain/user/user.entity';
import * as bcrypt from 'bcrypt';
// import { LoginAttempt } from 'src/domain/login-attempt/login-attempt.entity';
import { MockProxy, mock } from 'jest-mock-extended';
import { RegisterDto } from './cqrs/dto/register.dto';
import { LoginDto } from './cqrs/dto/login.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepositoryMock: MockProxy<IUserRepository>;
  let loginAttemptRepositoryMock: MockProxy<ILoginAttemptRepository>;
  let jwtServiceMock: MockProxy<JwtService>;

  beforeEach(async () => {
    userRepositoryMock = mock<IUserRepository>();
    loginAttemptRepositoryMock = mock<ILoginAttemptRepository>();
    jwtServiceMock = mock<JwtService>();

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'IUserRepository',
          useValue: userRepositoryMock,
        },
        {
          provide: 'ILoginAttemptRepository',
          useValue: loginAttemptRepositoryMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should return "User not found" if user is not found by email', async () => {
      userRepositoryMock.findByEmail.mockResolvedValue(null);

      const loginDto: LoginDto = {
        email: 'test@test.com',
        password: 'password',
      };
      const result = await authService.login(loginDto, '127.0.0.1');

      expect(result).toBe('User not found');
    });

    const fakeUser = new User(
      '1',
      'Test User',
      'test@test.com',
      'hashed_password',
    );

    it('should return "Invalid password" if the password is incorrect', async () => {
      userRepositoryMock.findByEmail.mockResolvedValue(fakeUser);
      loginAttemptRepositoryMock.countRecentAttemptsByEmail.mockResolvedValue(
        0,
      );
      loginAttemptRepositoryMock.countRecentAttemptsByIpAddress.mockResolvedValue(
        0,
      );

      const bcryptCompareSpy = jest
        .spyOn(bcrypt, 'compare')
        .mockResolvedValue(false);

      const loginDto: LoginDto = {
        email: 'test@test.com',
        password: 'incorrect_password',
      };
      const result = await authService.login(loginDto, '127.0.0.1');

      expect(result).toBe('Invalid password');
      expect(bcryptCompareSpy).toHaveBeenCalledWith(
        loginDto.password,
        fakeUser.password,
      );
    });

    it('should throw an error if there are too many failed login attempts', async () => {
      userRepositoryMock.findByEmail.mockResolvedValue(fakeUser);
      loginAttemptRepositoryMock.countRecentAttemptsByEmail.mockResolvedValue(
        5,
      );
      loginAttemptRepositoryMock.countRecentAttemptsByIpAddress.mockResolvedValue(
        0,
      );

      const loginDto: LoginDto = {
        email: 'test@test.com',
        password: 'password',
      };

      await expect(authService.login(loginDto, '127.0.0.1')).rejects.toThrow(
        new HttpException(
          'Too many failed login attempts. Please try again later.',
          HttpStatus.TOO_MANY_REQUESTS,
        ),
      );
    });

    it('should return a JWT token if the login is successful', async () => {
      userRepositoryMock.findByEmail.mockResolvedValue(fakeUser);
      loginAttemptRepositoryMock.countRecentAttemptsByEmail.mockResolvedValue(
        0,
      );
      loginAttemptRepositoryMock.countRecentAttemptsByIpAddress.mockResolvedValue(
        0,
      );
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jwtServiceMock.sign.mockReturnValue('jwt_token');

      const loginDto: LoginDto = {
        email: 'test@test.com',
        password: 'password',
      };
      const result = await authService.login(loginDto, '127.0.0.1');

      expect(JSON.parse(result)).toEqual({ access_token: 'jwt_token' });
      expect(jwtServiceMock.sign).toHaveBeenCalledWith({
        sub: fakeUser.id,
        email: fakeUser.email,
      });
    });
  });

  describe('register', () => {
    it('should throw an error if email is already in use', async () => {
      const existingUser = new User(
        '',
        'Test User',
        'test@test.com',
        'hashed_password',
      );
      userRepositoryMock.findByEmail.mockResolvedValue(existingUser);

      const registerDto = {
        name: 'Test User',
        email: 'test@test.com',
        password: 'password',
      };

      await expect(authService.register(registerDto)).rejects.toThrowError(
        'Email already in use',
      );
    });

    it('should successfully register a new user', async () => {
      userRepositoryMock.findByEmail.mockResolvedValue(null);
      userRepositoryMock.create.mockImplementation((user: User) =>
        Promise.resolve(user),
      );
      const bcryptHashSpy = jest
        .spyOn(bcrypt, 'hash')
        .mockResolvedValue('hashed_password');

      const registerDto: RegisterDto = {
        name: 'Test User',
        email: 'test@test.com',
        password: 'password',
      };
      const result = await authService.register(registerDto);

      expect(bcryptHashSpy).toHaveBeenCalled();
      expect(userRepositoryMock.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test User',
          email: 'test@test.com',
          password: 'hashed_password',
        }),
      );
      expect(result).toEqual(
        expect.objectContaining({
          name: 'Test User',
          email: 'test@test.com',
          password: 'hashed_password',
        }),
      );
    });

    it('should throw an error when password hashing fails', async () => {
      userRepositoryMock.findByEmail.mockResolvedValue(null);
      const bcryptHashSpy = jest
        .spyOn(bcrypt, 'hash')
        .mockRejectedValue(new Error('Hashing failed'));

      const registerDto: RegisterDto = {
        name: 'Test User',
        email: 'test@test.com',
        password: 'password',
      };

      await expect(authService.register(registerDto)).rejects.toThrowError(
        'Hashing failed',
      );
      expect(bcryptHashSpy).toHaveBeenCalled();
    });

    // Add more tests for register method here
  });
});
