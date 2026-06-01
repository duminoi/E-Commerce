import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { CartService } from '../cart/cart.service';
import { UserService } from '../user/user.service';
import { Product } from '../product/entities/product.entity';
import { ProductVariant } from '../product/entities/product-variant.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,
    private readonly cartService: CartService,
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
  ) {}

  async create(userId: string, dto: CreateOrderDto) {
    const { cart, total } = await this.cartService.getCart(userId);
    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Giỏ hàng trống');
    }

    const user = await this.userService.findById(userId);
    const address = (user as any).addresses?.find((a: any) => a.id === dto.addressId);
    if (!address) {
      throw new BadRequestException('Địa chỉ giao hàng không hợp lệ');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = queryRunner.manager.create(Order, {
        userId,
        totalPrice: total,
        shippingFee: 0,
        addressSnapshot: address,
        note: dto.note || null,
      });
      const savedOrder = await queryRunner.manager.save(order);

      for (const cartItem of cart.items) {
        const product = cartItem.product;
        const variant = cartItem.variant;

        const price = variant?.price ?? product.price;

        if (variant) {
          if (variant.quantity < cartItem.quantity) {
            throw new BadRequestException(`Sản phẩm "${product.name}" (${variant.value}) không đủ hàng`);
          }
          await queryRunner.manager.update(ProductVariant, variant.id, {
            quantity: variant.quantity - cartItem.quantity,
          });
        } else {
          if (product.quantity < cartItem.quantity) {
            throw new BadRequestException(`Sản phẩm "${product.name}" không đủ hàng`);
          }
          await queryRunner.manager.update(Product, product.id, {
            quantity: product.quantity - cartItem.quantity,
          });
        }

        await queryRunner.manager.save(OrderItem, {
          orderId: savedOrder.id,
          productId: product.id,
          variantId: variant?.id || null,
          productName: product.name,
          productImage: product.images?.[0]?.url || null,
          variantName: variant ? `${variant.name}: ${variant.value}` : null,
          price,
          quantity: cartItem.quantity,
        });
      }

      await queryRunner.manager.delete('cart_items', { cartId: cart.id });

      await queryRunner.commitTransaction();

      return this.orderRepo.findOne({
        where: { id: savedOrder.id },
        relations: { items: true },
      });
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findByUser(userId: string, page = 1, limit = 10) {
    const [items, total] = await this.orderRepo.findAndCount({
      where: { userId },
      relations: { items: true },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string, userId?: string) {
    const where: any = { id };
    if (userId) where.userId = userId;

    const order = await this.orderRepo.findOne({
      where,
      relations: { items: true },
    });

    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');
    return order;
  }

  async cancel(id: string, userId: string, reason?: string) {
    const order = await this.findById(id, userId);
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Chỉ có thể hủy đơn hàng đang chờ xử lý');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const item of order.items) {
        if (item.variantId) {
          await queryRunner.manager.increment(ProductVariant, { id: item.variantId }, 'quantity', item.quantity);
        } else if (item.productId) {
          await queryRunner.manager.increment(Product, { id: item.productId }, 'quantity', item.quantity);
        }
      }

      order.status = OrderStatus.CANCELLED;
      order.cancelledAt = new Date();
      order.cancelReason = reason || null;
      await queryRunner.manager.save(order);

      await queryRunner.commitTransaction();
      return order;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');

    order.status = status;
    if (status === OrderStatus.SHIPPING) order.shippedAt = new Date();
    if (status === OrderStatus.DELIVERED) order.deliveredAt = new Date();

    return this.orderRepo.save(order);
  }

  async findAll(page = 1, limit = 10) {
    const [items, total] = await this.orderRepo.findAndCount({
      relations: { items: true },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}
