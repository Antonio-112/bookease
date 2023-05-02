import { LoginDto } from '../dto/login.dto';

export class GetLoginQuery {
  constructor(public readonly loginDto: LoginDto, public readonly ip: string) {}
}
