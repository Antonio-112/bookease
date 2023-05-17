import { CreateBookingServiceDto } from '../dtos/create-booking-service.dto';

export class CreateBookingServiceCommand {
  constructor(public readonly createBookingService: CreateBookingServiceDto) {}
}
