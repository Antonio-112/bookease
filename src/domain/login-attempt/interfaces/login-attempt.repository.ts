import { LoginAttempt } from '../login-attempt.entity';

export interface ILoginAttemptRepository {
  create(failedLoginAttempt: LoginAttempt): Promise<LoginAttempt>;
  countRecentAttemptsByEmail(
    email: string,
    timeFrameMinutes: number,
  ): Promise<number>;
  countRecentAttemptsByIpAddress(
    ipAddress: string,
    timeFrameMinutes: number,
  ): Promise<number>;
}
