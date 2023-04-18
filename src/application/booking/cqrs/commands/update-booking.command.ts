import { UpdateBookingDto } from '../dtos/update-booking.dto';

export class UpdateBookingCommand {
  constructor(
    public readonly id: string,
    public readonly updateBookingDto: UpdateBookingDto,
  ) {}
}
