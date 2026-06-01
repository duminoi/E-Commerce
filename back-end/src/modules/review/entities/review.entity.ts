import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Product } from '../../product/entities/product.entity';
import { Order } from '../../order/entities/order.entity';

@Entity('reviews')
@Unique(['userId', 'productId', 'orderId'])
export class Review {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ name: 'user_id' }) userId: string;
  @ManyToOne(() => User, { onDelete: 'CASCADE' }) @JoinColumn({ name: 'user_id' }) user: User;

  @Column({ name: 'product_id' }) productId: string;
  @ManyToOne(() => Product, { onDelete: 'CASCADE' }) @JoinColumn({ name: 'product_id' }) product: Product;

  @Column({ name: 'order_id', nullable: true }) orderId: string;
  @ManyToOne(() => Order, { onDelete: 'SET NULL', nullable: true }) @JoinColumn({ name: 'order_id' }) order: Order;

  @Column({ type: 'int' }) rating: number;
  @Column({ type: 'varchar', nullable: true }) comment: string | null;

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}
