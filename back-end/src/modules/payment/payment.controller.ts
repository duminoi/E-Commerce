import { Controller, Post, Get, Body, Query, Req, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@Controller('payments')
export class PaymentController {
  constructor(private readonly service: PaymentService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async create(@Body('orderId') orderId: string, @Req() req: any) {
    const ip = req.headers['x-forwarded-for'] || req.ip;
    return this.service.createPayment(orderId, ip);
  }

  @Public()
  @Get('vnpay-return')
  async vnpayReturn(@Query() params: any) {
    return this.service.handleReturn(params);
  }
}
