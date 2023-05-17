import { UpdateBookingServiceDto } from '../dtos/update-booking-service.dto';

export class UpdateBookingServiceCommand {
  constructor(public readonly id: string, public readonly updateBookingService: UpdateBookingServiceDto) {}
}
