import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  addressId: string;

  @IsOptional()
  @IsString()
  note?: string;
}
