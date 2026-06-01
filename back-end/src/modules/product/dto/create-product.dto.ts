import { IsString, IsNumber, IsOptional, IsUUID, Min, MinLength, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 15 Pro Max' })
  @IsString() @MinLength(2) @MaxLength(200)
  name: string;

  @ApiProperty({ example: 'Điện thoại thông minh của Apple' })
  @IsString()
  description: string;

  @ApiProperty({ example: 29990000 })
  @IsNumber() @Min(0)
  @Type(() => Number)
  price: number;

  @ApiPropertyOptional({ example: 34990000 })
  @IsOptional()
  @IsNumber() @Min(0)
  @Type(() => Number)
  comparePrice?: number;

  @ApiProperty({ example: 100 })
  @IsNumber() @Min(0)
  @Type(() => Number)
  quantity: number;

  @ApiProperty({ example: 'uuid-category-id' })
  @IsUUID()
  categoryId: string;
}
