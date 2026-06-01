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

  @Column({ name: 'product_id', type: 'varchar', nullable: true })
  productId: string | null;

  @Column({ name: 'variant_id', type: 'varchar', nullable: true })
  variantId: string | null;

  @Column({ name: 'product_name', type: 'varchar' })
  productName: string;

  @Column({ name: 'product_image', type: 'varchar', nullable: true })
  productImage: string | null;

  @Column({ name: 'variant_name', type: 'varchar', nullable: true })
  variantName: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @Column({ type: 'int' })
  quantity: number;
}
