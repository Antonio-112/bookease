import { Module, Provider, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { AuthService } from './auth.service';
import { MongoModule } from '../../infrastructure/mongo/mongo.module';

const providers: Provider[] = [JwtAuthGuard, AuthService, JwtStrategy];
@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    MongoModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'jwt_secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [...providers],
  exports: [...providers],
})
export class AuthModule {}
