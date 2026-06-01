import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import slugify from 'slugify';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly repo: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.repo.find({ relations: { children: true, parent: true } });
  }

  async findTree(): Promise<Category[]> {
    const categories = await this.repo.find({ relations: { children: true, parent: true } });
    return categories.filter(c => !c.parentId);
  }

  async findBySlug(slug: string): Promise<Category> {
    const cat = await this.repo.findOne({ where: { slug }, relations: { children: true, parent: true } });
    if (!cat) throw new NotFoundException('Không tìm thấy danh mục');
    return cat;
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    const slug = dto.slug || slugify(dto.name, { lower: true, strict: true, locale: 'vi' });
    const category = this.repo.create({ ...dto, slug });
    return this.repo.save(category);
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.repo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Không tìm thấy danh mục');
    Object.assign(category, dto);
    if (dto.name && !dto.slug) {
      category.slug = slugify(dto.name, { lower: true, strict: true, locale: 'vi' });
    }
    return this.repo.save(category);
  }

  async remove(id: string): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Không tìm thấy danh mục');
  }
}
