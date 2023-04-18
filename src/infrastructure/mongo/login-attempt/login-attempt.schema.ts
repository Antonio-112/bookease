import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { LoginAttempt } from '../../../domain/login-attempt/login-attempt.entity';

@Schema({ timestamps: { createdAt: 'createdAt' } })
export class LoginAttemptDocument extends LoginAttempt {}

export const LoginAttemptSchema = SchemaFactory.createForClass(LoginAttempt);
