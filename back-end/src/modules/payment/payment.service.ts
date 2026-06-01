import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { VnpayService } from './vnpay.service';
import { OrderService } from '../order/order.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) private readonly paymentRepo: Repository<Payment>,
    private readonly vnpayService: VnpayService,
    private readonly orderService: OrderService,
  ) {}

  async createPayment(orderId: string, ipAddr: string) {
    const order = await this.orderService.findById(orderId);
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');

    let payment = await this.paymentRepo.findOne({ where: { orderId } });
    if (!payment) {
      payment = this.paymentRepo.create({ orderId, amount: order.totalPrice });
      payment = await this.paymentRepo.save(payment);
    }

    const paymentUrl = this.vnpayService.createPaymentUrl(
      order.id, order.totalPrice,
      `Thanh toán đơn hàng #${order.id.slice(0, 8)}`,
      ipAddr,
    );

    return { paymentUrl, payment };
  }

  async handleReturn(params: Record<string, string>) {
    const isValid = this.vnpayService.verifyReturn(params);
    if (!isValid) throw new BadRequestException('Chữ ký không hợp lệ');

    const txnRef = params['vnp_TxnRef'];
    const responseCode = params['vnp_ResponseCode'];

    const payment = await this.paymentRepo.findOne({ where: { vnpayTxnRef: txnRef } });
    if (!payment) throw new NotFoundException('Không tìm thấy giao dịch');

    if (responseCode === '00') {
      payment.status = PaymentStatus.SUCCESS;
      payment.paidAt = new Date();
      payment.vnpayResponseCode = responseCode;
      await this.paymentRepo.save(payment);
      return { success: true, message: 'Thanh toán thành công' };
    }

    payment.status = PaymentStatus.FAILED;
    payment.vnpayResponseCode = responseCode;
    await this.paymentRepo.save(payment);
    return { success: false, message: 'Thanh toán thất bại' };
  }
}
