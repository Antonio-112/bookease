import { CreateBookingDto } from '../dtos/create-booking.dto';

export class CreateBookingCommand {
  constructor(public readonly createBookingDto: CreateBookingDto) {}
}
