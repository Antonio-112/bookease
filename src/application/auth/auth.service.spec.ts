import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { IUserRepository } from '../../domain/user/interfaces/user.repository';
import { ILoginAttemptRepository } from '../../domain/login-attempt/login-attempt.repository';
import { JwtService } from '@nestjs/jwt';
// import { LoginDto } from './cqrs/dto/login.dto';
// import { RegisterDto } from './cqrs/dto/register.dto';
import { User } from '../../domain/user/user.entity';
// import { LoginAttempt } from 'src/domain/login-attempt/login-attempt.entity';
import { MockProxy, mock } from 'jest-mock-extended';

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

      const loginDto = {
        email: 'test@test.com',
        password: 'password',
      };
      const result = await authService.login(loginDto, '127.0.0.1');

      expect(result).toBe('User not found');
    });

    // Add more tests for login method here
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

    // Add more tests for register method here
  });
});
