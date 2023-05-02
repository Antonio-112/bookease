import { RegisterDto } from '../dto/register.dto';

export class CreateRegisterCommand {
  constructor(public readonly registerDto: RegisterDto) {}
}
