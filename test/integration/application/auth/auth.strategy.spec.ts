import { UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtStrategy } from '../../../../src/application/auth/strategies/jwt.strategy';
import { IUserRepository } from '../../../../src/domain/user/interfaces/user.repository';
import { User } from '../../../../src/domain/user/user.entity';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userRepository: IUserRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [JwtStrategy, { provide: 'IUserRepository', useValue: {} }],
    }).compile();

    jwtStrategy = moduleRef.get<JwtStrategy>(JwtStrategy);
    userRepository = moduleRef.get<IUserRepository>('IUserRepository');
  });

  describe('validate', () => {
    it('should return a user when the payload is valid', async () => {
      const payload = { sub: 1, email: 'test@example.com' };
      const user = new User('1', 'Test User', 'test@example.com', 'hashed-password');

      userRepository.findById = jest.fn().mockResolvedValue(user);

      const result = await jwtStrategy.validate(payload);
      expect(result).toEqual(user);
      expect(userRepository.findById).toHaveBeenCalledWith(payload.sub);
    });

    it('should throw an UnauthorizedException when the user is not found', async () => {
      const payload = { sub: 1, email: 'test@example.com' };

      userRepository.findById = jest.fn().mockResolvedValue(null);

      await expect(jwtStrategy.validate(payload)).rejects.toThrowError(UnauthorizedException);
      expect(userRepository.findById).toHaveBeenCalledWith(payload.sub);
    });
  });
});
