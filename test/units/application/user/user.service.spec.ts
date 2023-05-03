import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateUserCommand,
  UpdateUserCommand,
  DeleteUserCommand,
  UpdatePasswordCommand,
} from '../../../../src/application/user/cqrs/commands';
import { mock, MockProxy } from 'jest-mock-extended';
import { hash } from 'bcrypt';
import { GetUserQuery, GetUsersQuery } from '../../../../src/application/user/cqrs/queries';
import { UserService } from '../../../../src/application/user/user.service';
import { IUserRepository } from '../../../../src/domain/user/interfaces/user.repository';
import { User } from '../../../../src/domain/user/user.entity';

describe('UserService', () => {
  let service: UserService;
  let userRepository: MockProxy<IUserRepository>;

  beforeEach(async () => {
    userRepository = mock<IUserRepository>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'IUserRepository',
          useValue: userRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const expectedResult: User = new User('1', 'John Doe', 'john@example.com', 'password123');

      userRepository.create.mockResolvedValue(expectedResult);

      const result = await service.create(new CreateUserCommand(createUserDto));

      expect(result).toEqual(expectedResult);
      expect(userRepository.create).toHaveBeenCalledWith(expect.objectContaining(createUserDto));
    });
  });

  // Aquí van los tests para cada método del servicio

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const expectedResult: User[] = [
        // Rellena con el resultado esperado
      ];

      userRepository.findAll.mockResolvedValue(expectedResult);

      const result = await service.findAll(new GetUsersQuery());

      expect(result).toEqual(expectedResult);
      expect(userRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      const id = '1';
      const expectedResult: User = new User(id, 'John Doe', 'john@example.com', 'password123');

      userRepository.findById.mockResolvedValue(expectedResult);

      const result = await service.findById(new GetUserQuery(id));

      expect(result).toEqual(expectedResult);
      expect(userRepository.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const id = '1';
      const updateUserDto = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password456',
      };

      const expectedResult: User = new User(id, 'Jane Doe', 'jane@example.com', 'password456');

      userRepository.update.mockResolvedValue(expectedResult);

      const result = await service.update(new UpdateUserCommand(id, updateUserDto));

      expect(result).toEqual(expectedResult);
      expect(userRepository.update).toHaveBeenCalledWith(id, expect.any(User));
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const id = '1';
      const expectedResult = true;

      userRepository.delete.mockResolvedValue(expectedResult);

      const result = await service.delete(new DeleteUserCommand(id));

      expect(result).toEqual(expectedResult);
      expect(userRepository.delete).toHaveBeenCalledWith(id);
    });
  });

  describe('updatePassword', () => {
    it('should update the password of a user', async () => {
      const id = '1';
      const oldPassword = 'oldPassword123';
      const newPassword = 'newPassword123';
      const user = new User(id, 'John Doe', 'john@example.com', await hash(oldPassword, 10));

      userRepository.findById.mockResolvedValue(user);
      userRepository.updatePassword.mockResolvedValue(true);

      const result = await service.updatePassword(new UpdatePasswordCommand(id, newPassword, oldPassword));

      expect(result).toBeTruthy();
      expect(userRepository.findById).toHaveBeenCalledWith(id);
      expect(userRepository.updatePassword).toHaveBeenCalledWith(id, expect.any(String));
    });
  });
});
