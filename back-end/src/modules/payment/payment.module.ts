import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { VnpayService } from './vnpay.service';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    OrderModule,
  ],
  providers: [PaymentService, VnpayService],
  controllers: [PaymentController],
})
export class PaymentModule {}
