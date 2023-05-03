import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IUserRepository } from '../../../domain/user/interfaces/user.repository';
import { Inject } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger: Logger;
  constructor(@Inject('IUserRepository') private readonly userRepository: IUserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET ?? 'jwt_secret',
    });
    this.logger = new Logger(JwtStrategy.name);
  }

  async validate(payload: any) {
    try {
      this.logger.log('Validating JWT payload:', payload);
      const user = await this.userRepository.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (error) {
      this.logger.error('JWT validation error:', error);
      throw error;
    }
  }
}
