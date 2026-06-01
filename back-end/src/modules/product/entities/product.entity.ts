import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { ProductImage } from './product-image.entity';
import { ProductVariant } from './product-variant.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index('idx_product_name')
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @Column({ name: 'compare_price', type: 'decimal', precision: 12, scale: 2, nullable: true })
  comparePrice: number;

  @Column({ default: 0 })
  quantity: number;

  @Column({ default: 0 })
  sold: number;

  @Column({ name: 'is_active', default: true })
  @Index('idx_product_active')
  isActive: boolean;

  @Column({ name: 'category_id' })
  categoryId: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => ProductImage, (img) => img.product, { cascade: true })
  images: ProductImage[];

  @OneToMany(() => ProductVariant, (v) => v.product, { cascade: true })
  variants: ProductVariant[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Index('idx_product_updated')
  updatedAt: Date;
}
