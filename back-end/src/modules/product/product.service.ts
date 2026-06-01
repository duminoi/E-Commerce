import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {}

  async findAll(query: QueryProductDto) {
    const where: any = { isActive: true };

    if (query.search) {
      where.name = Like(`%${query.search}%`);
    }
    if (query.category) {
      where.category = { slug: query.category };
    }
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = Between(query.minPrice || 0, query.maxPrice || 999999999);
    }

    let order: any = { createdAt: 'DESC' };
    switch (query.sort) {
      case 'price_asc': order = { price: 'ASC' }; break;
      case 'price_desc': order = { price: 'DESC' }; break;
      case 'newest': order = { createdAt: 'DESC' }; break;
      case 'sold': order = { sold: 'DESC' }; break;
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const [items, total] = await this.repo.findAndCount({
      where, order,
      relations: { images: true, category: true },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string): Promise<Product> {
    const product = await this.repo.findOne({
      where: { id },
      relations: { images: true, variants: true, category: true },
    });
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');
    return product;
  }

  async findBySlug(slug: string): Promise<Product> {
    const product = await this.repo.findOne({
      where: { slug },
      relations: { images: true, variants: true, category: true },
    });
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');
    return product;
  }

  async findRelated(id: string, categoryId: string, limit = 8): Promise<Product[]> {
    return this.repo.find({
      where: { categoryId, isActive: true },
      relations: { images: true },
      take: limit,
      order: { sold: 'DESC' },
    });
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const product = this.repo.create({ ...dto, slug });
    return this.repo.save(product);
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.repo.findOne({ where: { id }, relations: { images: true, variants: true } });
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');
    Object.assign(product, dto);
    return this.repo.save(product);
  }

  async remove(id: string): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Không tìm thấy sản phẩm');
  }
}
