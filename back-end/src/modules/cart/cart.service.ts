import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly itemRepo: Repository<CartItem>,
  ) {}

  async getCart(userId: string) {
    let cart = await this.cartRepo.findOne({
      where: { user: { id: userId } as any },
      relations: {
        items: { product: { images: true }, variant: true },
      },
    });

    if (!cart) {
      cart = await this.cartRepo.save({ user: { id: userId } as any, items: [] });
    }

    const total = cart.items.reduce((sum, item) => {
      const price = item.variant?.price ?? item.product?.price ?? 0;
      return sum + price * item.quantity;
    }, 0);

    return { cart, total };
  }

  async addItem(userId: string, dto: AddToCartDto) {
    let cart = await this.cartRepo.findOne({
      where: { user: { id: userId } as any },
    });

    if (!cart) {
      cart = await this.cartRepo.save({ user: { id: userId } as any });
    }

    const existingItem = await this.itemRepo.findOne({
      where: { cartId: cart.id, productId: dto.productId, variantId: dto.variantId || undefined },
    });

    if (existingItem) {
      existingItem.quantity += dto.quantity;
      await this.itemRepo.save(existingItem);
    } else {
      await this.itemRepo.save({
        cartId: cart.id,
        productId: dto.productId,
        variantId: dto.variantId || undefined,
        quantity: dto.quantity,
      });
    }

    return this.getCart(userId);
  }

  async updateItem(userId: string, itemId: string, dto: UpdateCartItemDto) {
    const cart = await this.cartRepo.findOne({
      where: { user: { id: userId } as any },
    });
    if (!cart) throw new NotFoundException('Giỏ hàng trống');

    await this.itemRepo.update(
      { id: itemId, cartId: cart.id },
      { quantity: dto.quantity },
    );

    return this.getCart(userId);
  }

  async removeItem(userId: string, itemId: string) {
    const cart = await this.cartRepo.findOne({
      where: { user: { id: userId } as any },
    });
    if (!cart) throw new NotFoundException('Giỏ hàng trống');

    await this.itemRepo.delete({ id: itemId, cartId: cart.id });
    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    const cart = await this.cartRepo.findOne({
      where: { user: { id: userId } as any },
    });
    if (cart) {
      await this.itemRepo.delete({ cartId: cart.id });
    }
    return { message: 'Đã xóa toàn bộ giỏ hàng' };
  }
}
