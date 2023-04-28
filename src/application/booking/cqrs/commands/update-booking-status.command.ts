import { UpdateBookingStatusDto } from '../dtos/update-booking-status.dto';

export class UpdateBookingStatusCommand {
  constructor(
    public readonly id: string,
    public readonly status: UpdateBookingStatusDto,
  ) {}
}
