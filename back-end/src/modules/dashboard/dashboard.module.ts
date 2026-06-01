import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../order/entities/order.entity';
import { User } from '../user/entities/user.entity';
import { Product } from '../product/entities/product.entity';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User, Product])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
