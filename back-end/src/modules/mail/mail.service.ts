import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendOrderConfirmation(to: string, orderId: string, total: number) {
    await this.mailerService.sendMail({
      to,
      subject: `Xác nhận đơn hàng #${orderId.slice(0, 8)}`,
      html: `<h1>Cảm ơn bạn đã đặt hàng!</h1><p>Đơn hàng <strong>#${orderId.slice(0, 8)}</strong> đã được xác nhận.</p><p>Tổng tiền: <strong>${total.toLocaleString('vi-VN')}đ</strong></p>`,
    });
  }

  async sendPasswordReset(to: string, resetToken: string) {
    await this.mailerService.sendMail({
      to,
      subject: 'Đặt lại mật khẩu',
      html: `<h1>Đặt lại mật khẩu</h1><p>Mã xác thực: <strong>${resetToken}</strong></p><p>Mã này có hiệu lực trong 15 phút.</p>`,
    });
  }
}
