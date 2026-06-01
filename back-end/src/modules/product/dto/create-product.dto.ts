import { IsString, IsNumber, IsOptional, IsUUID, Min, MinLength, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString() @MinLength(2) @MaxLength(200)
  name: string;

  @IsString()
  description: string;

  @IsNumber() @Min(0)
  @Type(() => Number)
  price: number;

  @IsOptional()
  @IsNumber() @Min(0)
  @Type(() => Number)
  comparePrice?: number;

  @IsNumber() @Min(0)
  @Type(() => Number)
  quantity: number;

  @IsUUID()
  categoryId: string;
}
