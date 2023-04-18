import {
  IsNotEmpty,
  IsString,
  IsDate,
  IsIn,
  IsOptional,
} from 'class-validator';

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
  @IsString()
  @IsIn(['confirmed', 'cancelled'])
  status: string;
}
