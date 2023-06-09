import { CreateBookingDto } from 'src/application/booking/cqrs';
import { BookingStatus } from 'src/domain/booking/booking.entity';

export const createBookingDtoMock: CreateBookingDto = {
  name: 'Test Name',
  date: new Date(),
  hairdresser: 'Test Hairdresser',
  status: BookingStatus.CONFIRMED,
  service: [],
  note: '',
  phoneNumber: '',
};
