import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  Min,
  IsPhoneNumber,
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  ValidateNested,
  IsDate,
  IsDateString,
} from 'class-validator';
import { BookingStatus } from '../../../../domain/booking/booking.entity';
import { Type } from 'class-transformer';
import { CreateBookingServiceDto } from 'src/application/booking-service/cqrs';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @IsNotEmpty()
  @IsString()
  hairdresser: string;

  @IsNotEmpty()
  @IsEnum(BookingStatus)
  status: BookingStatus;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  service: string[];

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  duration: number;

  @IsOptional()
  @IsString()
  note: string;

  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber()
  phoneNumber: string;
}
