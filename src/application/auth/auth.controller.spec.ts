import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './cqrs/dto/login.dto';
import { RegisterDto } from './cqrs/dto/register.dto';
import { mock, MockProxy } from 'jest-mock-extended';
import { User } from '../../domain/user/user.entity';
import { GetLoginQuery } from './cqrs/queries';
import { CreateRegisterCommand } from './cqrs/commands';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: MockProxy<AuthService>;

  beforeEach(async () => {
    authService = mock<AuthService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return a jwt token', async () => {
      const loginDto: LoginDto = {
        email: 'john@example.com',
        password: 'password123',
      };
      const ipAddress = '127.0.0.1';
      const expectedResult = 'jwt_token';

      authService.login.mockResolvedValue(expectedResult);

      const req = { ip: ipAddress };
      const result = await controller.login(loginDto, req as any);

      expect(result).toEqual(expectedResult);
      expect(authService.login).toHaveBeenCalledWith(
        new GetLoginQuery(loginDto, ipAddress),
      );
    });
  });

  describe('register', () => {
    it('should register a user and return a jwt token', async () => {
      const registerDto: RegisterDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };
      const expectedResult = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      authService.register.mockResolvedValue(expectedResult as User);

      const result = await controller.register(registerDto);

      expect(result).toEqual(expectedResult);
      expect(authService.register).toHaveBeenCalledWith(
        new CreateRegisterCommand(registerDto),
      );
    });
  });
});
