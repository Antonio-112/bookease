import { IsString, IsOptional, IsDate, IsEnum } from 'class-validator';
import { BookingStatus } from 'src/domain/booking/booking.entity';

export class UpdateBookingDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsDate()
  date?: Date;

  @IsOptional()
  @IsString()
  hairdresser?: string;

  @IsOptional()
  @IsString()
  @IsEnum(BookingStatus)
  status?: BookingStatus;
}
