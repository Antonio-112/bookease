import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginAttemptRepository } from '../../../../src/infrastructure/mongo/login-attempt/login-attempt.repository';
import { LoginAttempt } from '../../../../src/domain/login-attempt/login-attempt.entity';

describe('LoginAttemptRepository', () => {
  let repository: LoginAttemptRepository;
  let loginAttemptModel: Model<LoginAttempt>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginAttemptRepository,
        {
          provide: getModelToken(LoginAttempt.name),
          useValue: Model,
        },
      ],
    }).compile();

    repository = module.get<LoginAttemptRepository>(LoginAttemptRepository);
    loginAttemptModel = module.get<Model<LoginAttempt>>(getModelToken(LoginAttempt.name));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('countRecentAttemptsByEmail', () => {
    it('should count recent failed login attempts by email within the specified time frame', async () => {
      // Arrange
      const email = 'test@example.com';
      const timeFrameMinutes = 5;
      const countSpy = jest.spyOn(loginAttemptModel, 'countDocuments').mockResolvedValue(2);

      // Act
      const result = await repository.countRecentAttemptsByEmail(email, timeFrameMinutes);

      // Assert
      expect(countSpy).toHaveBeenCalledWith({
        email,
        createdAt: { $gte: expect.any(Date) },
      });
      expect(result).toEqual(2);
    });
  });

  describe('countRecentAttemptsByIpAddress', () => {
    it('should count recent failed login attempts by IP address within the specified time frame', async () => {
      // Arrange
      const ipAddress = '127.0.0.1';
      const timeFrameMinutes = 5;
      const countSpy = jest.spyOn(loginAttemptModel, 'countDocuments').mockResolvedValue(3);

      // Act
      const result = await repository.countRecentAttemptsByIpAddress(ipAddress, timeFrameMinutes);

      // Assert
      expect(countSpy).toHaveBeenCalledWith({
        ipAddress,
        createdAt: { $gte: expect.any(Date) },
      });
      expect(result).toEqual(3);
    });
  });
});
