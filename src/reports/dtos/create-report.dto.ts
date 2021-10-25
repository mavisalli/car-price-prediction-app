import {
  IsString,
  IsNumber,
  Min,
  Max,
  min,
  IsLongitude,
  IsLatitude,
} from 'class-validator';

export class CreateReportDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  @Max(2050)
  year: number;

  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number;

  @IsLongitude()
  lng: number;
  @IsLatitude()
  lat: number;

  @IsNumber()
  @Min(0)
  @Max(1000000)
  price: number;
}
