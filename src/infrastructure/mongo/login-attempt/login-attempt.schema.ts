import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { LoginAttempt } from '../../../domain/login-attempt/login-attempt.entity';
import * as mongoose from 'mongoose';
@Schema({ timestamps: { createdAt: 'createdAt' } })
export class LoginAttemptDocument extends LoginAttempt {}

export const LoginAttemptSchema = new mongoose.Schema({
  id: String,
  email: String,
  ipAddress: String,
  createdAt: Date,
});
