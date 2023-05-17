import {
  IsString,
  IsOptional,
  IsDate,
  IsEnum,
  IsNumber,
  Min,
  IsPhoneNumber,
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
} from 'class-validator';
import { BookingStatus } from '../../../../domain/booking/booking.entity';

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

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  service?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  duration?: number;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  phoneNumber?: string;
}
