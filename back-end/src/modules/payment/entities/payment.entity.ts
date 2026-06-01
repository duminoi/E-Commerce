import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Order } from '../../order/entities/order.entity';

export enum PaymentMethod { VNPAY = 'VNPAY', COD = 'COD' }
export enum PaymentStatus { PENDING = 'PENDING', SUCCESS = 'SUCCESS', FAILED = 'FAILED', REFUNDED = 'REFUNDED' }

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ name: 'order_id' }) orderId: string;
  @OneToOne(() => Order, { onDelete: 'CASCADE' }) @JoinColumn({ name: 'order_id' }) order: Order;

  @Column({ type: 'decimal', precision: 14, scale: 2 }) amount: number;
  @Column({ type: 'enum', enum: PaymentMethod, default: PaymentMethod.VNPAY }) method: PaymentMethod;
  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING }) status: PaymentStatus;

  @Column({ nullable: true }) vnpayTxnRef: string;
  @Column({ nullable: true }) vnpayResponseCode: string;
  @Column({ name: 'paid_at', type: 'timestamp', nullable: true }) paidAt: Date;

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}
