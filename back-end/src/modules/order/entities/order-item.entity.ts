import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_id' })
  orderId: string;

  @ManyToOne(() => Order, (o) => o.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'product_id', nullable: true })
  productId: string;

  @Column({ name: 'variant_id', nullable: true })
  variantId: string | null;

  @Column({ name: 'product_name' })
  productName: string;

  @Column({ name: 'product_image', nullable: true })
  productImage: string | null;

  @Column({ name: 'variant_name', nullable: true })
  variantName: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @Column()
  quantity: number;
}
