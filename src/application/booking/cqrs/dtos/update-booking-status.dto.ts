import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { BookingStatus } from '../../../../domain/booking/booking.entity';

export class UpdateBookingStatusDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(BookingStatus)
  status: BookingStatus;
}
