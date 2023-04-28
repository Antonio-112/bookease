import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info: Error, context: ExecutionContext) {
    console.log(
      'Handling JWT auth request:',
      context.switchToHttp().getRequest(),
    );
    return super.handleRequest(err, user, info, context);
  }
}
