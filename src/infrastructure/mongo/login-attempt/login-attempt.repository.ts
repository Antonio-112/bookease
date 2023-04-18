import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginAttempt } from '../../../domain/login-attempt/login-attempt.entity';
import { ILoginAttemptRepository } from '../../../domain/login-attempt/login-attempt.repository';
import { Logger } from '@nestjs/common';

@Injectable()
export class LoginAttemptRepository implements ILoginAttemptRepository {
  private readonly logger = new Logger(LoginAttemptRepository.name);

  constructor(
    @InjectModel(LoginAttempt.name)
    private readonly loginAttemptModel: Model<LoginAttempt>,
  ) {}

  // Create a new failed login attempt
  async create(failedLoginAttempt: LoginAttempt): Promise<LoginAttempt> {
    this.logger.debug('Creating a new failed login attempt');
    const createdFailedLoginAttempt = new this.loginAttemptModel(
      failedLoginAttempt,
    );
    return createdFailedLoginAttempt.save();
  }

  // Count recent failed login attempts by email within the specified time frame
  async countRecentAttemptsByEmail(
    email: string,
    timeFrameMinutes: number,
  ): Promise<number> {
    this.logger.debug(
      `Counting recent login attempts by email: ${email} within the past ${timeFrameMinutes} minutes`,
    );
    const timeFrameDate = new Date(Date.now() - timeFrameMinutes * 60 * 1000);
    return this.loginAttemptModel.countDocuments({
      email,
      createdAt: { $gte: timeFrameDate },
    });
  }

  // Count recent failed login attempts by IP address within the specified time frame
  async countRecentAttemptsByIpAddress(
    ipAddress: string,
    timeFrameMinutes: number,
  ): Promise<number> {
    this.logger.debug(
      `Counting recent login attempts by IP address: ${ipAddress} within the past ${timeFrameMinutes} minutes`,
    );
    const timeFrameDate = new Date(Date.now() - timeFrameMinutes * 60 * 1000);
    return this.loginAttemptModel.countDocuments({
      ipAddress,
      createdAt: { $gte: timeFrameDate },
    });
  }
}
