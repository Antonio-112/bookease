import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { BookingStatus } from 'src/domain/booking/booking.entity';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  date: Date;

  @IsNotEmpty()
  @IsString()
  hairdresser: string;

  @IsNotEmpty()
  @IsEnum(BookingStatus)
  status: BookingStatus;
}
