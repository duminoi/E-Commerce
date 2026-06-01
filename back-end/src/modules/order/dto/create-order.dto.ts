import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: 'uuid-address-id' })
  @IsUUID()
  addressId: string;

  @ApiPropertyOptional({ example: 'Giao hàng giờ hành chính' })
  @IsOptional()
  @IsString()
  note?: string;
}
