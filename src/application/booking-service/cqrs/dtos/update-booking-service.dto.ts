import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateBookingServiceDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  details: string;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  duration: number;
}
