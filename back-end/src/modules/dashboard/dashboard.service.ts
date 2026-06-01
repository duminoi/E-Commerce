import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../order/entities/order.entity';
import { User } from '../user/entities/user.entity';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
  ) {}

  async getStats() {
    const totalOrders = await this.orderRepo.count();
    const totalUsers = await this.userRepo.count();
    const totalProducts = await this.productRepo.count();
    const revenueResult = await this.orderRepo
      .createQueryBuilder('o')
      .select('COALESCE(SUM(o.totalPrice), 0)', 'total')
      .where("o.status NOT IN ('CANCELLED')")
      .getRawOne();
    const recentOrders = await this.orderRepo.find({
      relations: { items: true },
      order: { createdAt: 'DESC' },
      take: 5,
    });
    return {
      totalOrders,
      totalUsers,
      totalProducts,
      revenue: parseFloat(revenueResult?.total || '0'),
      recentOrders,
    };
  }
}
