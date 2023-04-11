import { IsString, IsOptional, IsDate, IsIn } from 'class-validator';

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
  @IsIn(['confirmed', 'cancelled'])
  status?: string;
}
