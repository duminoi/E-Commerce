import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class VnpayService {
  private tmnCode: string;
  private hashSecret: string;
  private vnpayUrl: string;
  private returnUrl: string;

  constructor(private configService: ConfigService) {
    this.tmnCode = configService.get('VNPAY_TMN_CODE') || '';
    this.hashSecret = configService.get('VNPAY_HASH_SECRET') || '';
    this.vnpayUrl = configService.get('VNPAY_URL') || '';
    this.returnUrl = configService.get('VNPAY_RETURN_URL') || '';
  }

  createPaymentUrl(orderId: string, amount: number, orderInfo: string, ipAddr: string): string {
    const date = new Date();
    const createDate = date.toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
    const txnRef = `${orderId}-${Date.now()}`;

    const params: Record<string, string> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: this.tmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: 'other',
      vnp_Amount: String(Math.round(amount * 100)),
      vnp_ReturnUrl: this.returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    const sortedKeys = Object.keys(params).sort();
    const signData = sortedKeys.map(key => `${key}=${encodeURIComponent(params[key])}`).join('&');
    const secureHash = crypto.createHmac('sha512', this.hashSecret).update(Buffer.from(signData, 'utf-8')).digest('hex');

    return `${this.vnpayUrl}?${signData}&vnp_SecureHash=${secureHash}`;
  }

  verifyReturn(params: Record<string, string>): boolean {
    const secureHash = params['vnp_SecureHash'];
    const signData = Object.keys(params)
      .filter(key => key.startsWith('vnp_') && key !== 'vnp_SecureHash')
      .sort()
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');
    const computedHash = crypto.createHmac('sha512', this.hashSecret).update(Buffer.from(signData, 'utf-8')).digest('hex');
    return secureHash === computedHash;
  }
}
