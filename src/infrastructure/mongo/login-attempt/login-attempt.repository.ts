import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginAttempt } from '../../../domain/login-attempt/login-attempt.entity';
import { ILoginAttemptRepository } from '../../../domain/login-attempt/login-attempt.repository';

@Injectable()
export class LoginAttemptRepository implements ILoginAttemptRepository {
  constructor(
    @InjectModel(LoginAttempt.name)
    private readonly loginAttemptModel: Model<LoginAttempt>,
  ) {}

  async create(failedLoginAttempt: LoginAttempt): Promise<LoginAttempt> {
    const createdFailedLoginAttempt = new this.loginAttemptModel(
      failedLoginAttempt,
    );
    return createdFailedLoginAttempt.save();
  }

  async countRecentAttemptsByEmail(
    email: string,
    timeFrameMinutes: number,
  ): Promise<number> {
    const timeFrameDate = new Date(Date.now() - timeFrameMinutes * 60 * 1000);
    return this.loginAttemptModel.countDocuments({
      email,
      createdAt: { $gte: timeFrameDate },
    });
  }

  async countRecentAttemptsByIpAddress(
    ipAddress: string,
    timeFrameMinutes: number,
  ): Promise<number> {
    const timeFrameDate = new Date(Date.now() - timeFrameMinutes * 60 * 1000);
    return this.loginAttemptModel.countDocuments({
      ipAddress,
      createdAt: { $gte: timeFrameDate },
    });
  }
}
