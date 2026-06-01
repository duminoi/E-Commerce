import { IsUUID, IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: 'uuid-product-id' }) @IsUUID() productId: string;
  @ApiProperty({ example: 'uuid-order-id' }) @IsUUID() orderId: string;
  @ApiProperty({ example: 5 }) @IsNumber() @Min(1) @Max(5) rating: number;
  @ApiPropertyOptional({ example: 'Sản phẩm rất tốt!' }) @IsOptional() @IsString() comment?: string;
}

export class UpdateReviewDto {
  @ApiProperty({ example: 4 }) @IsNumber() @Min(1) @Max(5) rating: number;
  @ApiPropertyOptional({ example: 'Sản phẩm tốt' }) @IsOptional() @IsString() comment?: string;
}
