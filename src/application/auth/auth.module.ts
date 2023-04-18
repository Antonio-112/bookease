import { Module, Provider } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
// import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { AuthService } from './auth.service';
import { MongoModule } from 'src/infrastructure/mongo/mongo.module';

const providers: Provider[] = [JwtAuthGuard, AuthService];
@Module({
  imports: [
    UserModule,
    PassportModule,
    MongoModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'jwt_secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [/* JwtStrategy, */ ...providers],
})
export class AuthModule {}
