import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../../src/application/user/user.controller';
import { UserService } from '../../../src/application/user/user.service';
import { CreateUserDto } from '../../../src/application/user/cqrs/dtos/create-user.dto';
import { UpdateUserDto } from '../../../src/application/user/cqrs/dtos/update-user.dto';
import { UpdatePasswordDto } from '../../../src/application/user/cqrs/dtos/update-password.dto';
import { User } from '../../../src/domain/user/user.entity';
import { CreateUserCommand } from '../../../src/application/user/cqrs/commands/create-user.command';
import { UpdateUserCommand } from '../../../src/application/user/cqrs/commands/update-user.command';
import { DeleteUserCommand } from '../../../src/application/user/cqrs/commands/delete-user.command';
import { UpdatePasswordCommand } from '../../../src/application/user/cqrs/commands/update-password.command';
import { GetUserQuery } from '../../../src/application/user/cqrs/queries/get-user.query';
import { GetUsersQuery } from '../../../src/application/user/cqrs/queries/get-users.query';
import { mock, MockProxy } from 'jest-mock-extended';

describe('UserController', () => {
  let controller: UserController;
  let userService: MockProxy<UserService>;

  beforeEach(async () => {
    userService = mock<UserService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: userService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'antonio@mail.com',
        name: 'antonio',
        password: 'password',
      };

      const expectedResult = {
        email: 'antonio@mail.com',
        name: 'antonio',
        password: 'password',
      };

      userService.create.mockResolvedValue(expectedResult as User);

      const result = await controller.create(createUserDto);

      expect(result).toEqual(expectedResult);
      expect(userService.create).toHaveBeenCalledWith(
        new CreateUserCommand(createUserDto),
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const expectedResult = [
        {
          email: 'antonio@mail.com',
          name: 'antonio',
          password: 'password',
        },
      ];

      userService.findAll.mockResolvedValue(expectedResult as User[]);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(userService.findAll).toHaveBeenCalledWith(new GetUsersQuery());
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      const id = '1';
      const expectedResult = {
        id: '1',
        email: 'antonio@mail.com',
        name: 'antonio',
        password: 'password',
      };

      userService.findById.mockResolvedValue(expectedResult as User);

      const result = await controller.findById(id);

      expect(result).toEqual(expectedResult);
      expect(userService.findById).toHaveBeenCalledWith(new GetUserQuery(id));
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const id = '1';
      const updateUserDto: UpdateUserDto = {
        email: 'antonio@mail.com',
        name: 'antonio',
        password: 'password',
      };

      const expectedResult = {
        email: 'antonio@mail.com',
        name: 'antonio',
        password: 'password',
      };

      userService.update.mockResolvedValue(expectedResult as User);

      const result = await controller.update(id, updateUserDto);

      expect(result).toEqual(expectedResult);
      expect(userService.update).toHaveBeenCalledWith(
        new UpdateUserCommand(id, updateUserDto),
      );
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const id = '1';
      const expectedResult = true;

      userService.delete.mockResolvedValue(expectedResult);

      const result = await controller.delete(id);

      expect(result).toEqual(expectedResult);
      expect(userService.delete).toHaveBeenCalledWith(
        new DeleteUserCommand(id),
      );
    });
  });

  describe('updatePassword', () => {
    it('should update the password of a user', async () => {
      const id = '1';
      const updatePasswordDto: UpdatePasswordDto = {
        oldPassword: 'oldPassword123',
        newPassword: 'newPassword123',
      };
      const expectedResult = true;

      userService.updatePassword.mockResolvedValue(expectedResult);

      const result = await controller.updatePassword(id, updatePasswordDto);

      expect(result).toEqual(expectedResult);
      expect(userService.updatePassword).toHaveBeenCalledWith(
        new UpdatePasswordCommand(
          id,
          updatePasswordDto.newPassword,
          updatePasswordDto.oldPassword,
        ),
      );
    });
  });
});
