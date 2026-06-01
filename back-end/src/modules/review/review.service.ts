import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { OrderService } from '../order/order.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review) private readonly repo: Repository<Review>,
    private readonly orderService: OrderService,
  ) {}

  async findByProduct(productId: string, page = 1, limit = 10) {
    const [items, total] = await this.repo.findAndCount({
      where: { productId },
      relations: { user: true },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit, take: limit,
    });
    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async create(userId: string, dto: CreateReviewDto) {
    const order = await this.orderService.findById(dto.orderId, userId);
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');
    if (order.status !== 'DELIVERED') throw new BadRequestException('Chỉ có thể đánh giá sau khi nhận hàng');

    const existing = await this.repo.findOne({ where: { userId, productId: dto.productId, orderId: dto.orderId } });
    if (existing) throw new BadRequestException('Bạn đã đánh giá sản phẩm này trong đơn hàng này');

    const review = this.repo.create({ userId, ...dto });
    return this.repo.save(review);
  }

  async update(id: string, userId: string, dto: { rating: number; comment?: string }) {
    const review = await this.repo.findOne({ where: { id, userId } });
    if (!review) throw new NotFoundException('Không tìm thấy đánh giá');
    Object.assign(review, dto);
    return this.repo.save(review);
  }

  async remove(id: string, userId: string) {
    const result = await this.repo.delete({ id, userId });
    if (result.affected === 0) throw new NotFoundException('Không tìm thấy đánh giá');
  }

  async getAvgRating(productId: string): Promise<number> {
    const result = await this.repo
      .createQueryBuilder('r')
      .select('AVG(r.rating)', 'avg')
      .where('r.productId = :productId', { productId })
      .getRawOne();
    return parseFloat(result?.avg || '0');
  }
}
