import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class LoginAttempt {
  @Prop({ type: String, required: true })
  id: string;
  @Prop({ type: String, required: true })
  email: string;
  @Prop({ type: String, required: true })
  ipAddress: string;
  @Prop({ type: Date, required: true })
  createdAt: Date;
}

export const LoginAttemptSchema = SchemaFactory.createForClass(LoginAttempt);
