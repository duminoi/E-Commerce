# Phase 2: Product Management — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement full product management: categories (tree), products (with images and variants), file upload, pagination, search, filter, sort.

**Architecture:** New NestJS modules (category, product, upload) + React pages (product list, product detail). Categories use self-referencing tree. Products use TypeORM relations with images and variants.

**Tech Stack:** NestJS, TypeORM, PostgreSQL, multer, React, Zustand, TailwindCSS

---

### Task 2.1: Category Entity + Module

**Files:**
- Create: `back-end/src/modules/category/entities/category.entity.ts`
- Create: `back-end/src/modules/category/dto/create-category.dto.ts`
- Create: `back-end/src/modules/category/dto/update-category.dto.ts`
- Create: `back-end/src/modules/category/category.service.ts`
- Create: `back-end/src/modules/category/category.controller.ts`
- Create: `back-end/src/modules/category/category.module.ts`
- Modify: `back-end/src/app.module.ts`

**File details:**

`category.entity.ts`:
```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, Tree, TreeChildren, TreeParent } from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column({ name: 'parent_id', nullable: true })
  parentId: string;

  @ManyToOne(() => Category, (cat) => cat.children)
  @JoinColumn({ name: 'parent_id' })
  parent: Category;

  @OneToMany(() => Category, (cat) => cat.parent)
  children: Category[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

`create-category.dto.ts`:
```typescript
import { IsString, IsOptional, IsUUID, MinLength, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;
}
```

`update-category.dto.ts`:
```typescript
import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
```

`category.service.ts`:
```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    return this.repo.find({ relations: ['children', 'parent'] });
  }

  async findTree(): Promise<Category[]> {
    const categories = await this.repo.find({ relations: ['children', 'parent'] });
    return categories.filter(c => !c.parentId);
  }

  async findBySlug(slug: string): Promise<Category> {
    const cat = await this.repo.findOne({ where: { slug }, relations: ['children', 'parent'] });
    if (!cat) throw new NotFoundException('Không tìm thấy danh mục');
    return cat;
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    const slug = dto.slug || dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const category = this.repo.create({ ...dto, slug });
    return this.repo.save(category);
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.repo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Không tìm thấy danh mục');
    Object.assign(category, dto);
    if (dto.name && !dto.slug) {
      category.slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    return this.repo.save(category);
  }

  async remove(id: string): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Không tìm thấy danh mục');
  }
}
```

`category.controller.ts`:
```typescript
import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Role } from '../../common/enums/role.enum';

@Controller('categories')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Public()
  @Get()
  findAll() { return this.service.findTree(); }

  @Public()
  @Get(':slug')
  findBySlug(@Param('slug') slug: string) { return this.service.findBySlug(slug); }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateCategoryDto) { return this.service.create(dto); }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
```

`category.module.ts`: standard NestJS module with TypeOrm.forFeature([Category]), CategoryService, CategoryController.

`app.module.ts`: add `CategoryModule` to imports.

### Task 2.2: Product Entity

**Files:**
- Create: `back-end/src/modules/product/entities/product.entity.ts`
- Create: `back-end/src/modules/product/entities/product-image.entity.ts`
- Create: `back-end/src/modules/product/entities/product-variant.entity.ts`

Product entity:
```typescript
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
```

ProductImage entity:
```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'product_id' })
  productId: string;

  @ManyToOne(() => Product, (p) => p.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column()
  url: string;

  @Column({ name: 'is_thumbnail', default: false })
  isThumbnail: boolean;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;
}
```

ProductVariant entity:
```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'product_id' })
  productId: string;

  @ManyToOne(() => Product, (p) => p.variants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column()
  name: string;

  @Column()
  value: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  price: number;

  @Column({ default: 0 })
  quantity: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
```

### Task 2.3: Product Module (Service + Controller + DTOs)

**Files:**
- Create: `back-end/src/modules/product/dto/create-product.dto.ts`
- Create: `back-end/src/modules/product/dto/update-product.dto.ts`
- Create: `back-end/src/modules/product/dto/query-product.dto.ts`
- Create: `back-end/src/modules/product/product.service.ts`
- Create: `back-end/src/modules/product/product.controller.ts`
- Create: `back-end/src/modules/product/product.module.ts`

`query-product.dto.ts`:
```typescript
import { IsOptional, IsString, IsBoolean, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryProductDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @IsString()
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'oldest' | 'sold';

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 20;
}
```

`product.service.ts` — quan trọng:
```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, FindOptionsWhere } from 'typeorm';
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
    const where: FindOptionsWhere<Product> = { isActive: true };
    
    if (query.search) {
      where.name = Like(`%${query.search}%`);
    }
    if (query.category) {
      where.category = { slug: query.category } as any;
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

    const [items, total] = await this.repo.findAndCount({
      where, order,
      relations: ['images', 'category'],
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });

    return {
      items,
      meta: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) },
    };
  }

  async findBySlug(slug: string): Promise<Product> {
    const product = await this.repo.findOne({
      where: { slug },
      relations: ['images', 'variants', 'category'],
    });
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');
    return product;
  }

  async findRelated(id: string, categoryId: string, limit = 8): Promise<Product[]> {
    return this.repo.find({
      where: { categoryId, isActive: true },
      relations: ['images'],
      take: limit,
      order: { sold: 'DESC' },
    });
  }

  async create(dto: CreateProductDto & { images?: { url: string; isThumbnail: boolean; sortOrder: number }[] }) {
    const slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const product = this.repo.create({ ...dto, slug });
    return this.repo.save(product);
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.repo.findOne({ where: { id }, relations: ['images', 'variants'] });
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');
    Object.assign(product, dto);
    return this.repo.save(product);
  }

  async remove(id: string) {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Không tìm thấy sản phẩm');
  }
}
```

`product.controller.ts`:
```typescript
import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Role } from '../../common/enums/role.enum';

@Controller('products')
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Public()
  @Get()
  findAll(@Query() query: QueryProductDto) { return this.service.findAll(query); }

  @Public()
  @Get('related/:id')
  findRelated(@Param('id') id: string) {
    return this.service.findById(id).then(p => this.service.findRelated(id, p.categoryId));
  }

  @Public()
  @Get(':slug')
  findBySlug(@Param('slug') slug: string) { return this.service.findBySlug(slug); }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateProductDto) { return this.service.create(dto); }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
```

`create-product.dto.ts`:
```typescript
import { IsString, IsNumber, IsOptional, IsUUID, Min, MinLength, MaxLength, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString() @MinLength(2) @MaxLength(200)
  name: string;

  @IsString()
  description: string;

  @IsNumber() @Min(0)
  @Type(() => Number)
  price: number;

  @IsOptional()
  @IsNumber() @Min(0)
  @Type(() => Number)
  comparePrice?: number;

  @IsNumber() @Min(0)
  @Type(() => Number)
  quantity: number;

  @IsUUID()
  categoryId: string;
}
```

`update-product.dto.ts`:
```typescript
import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
export class UpdateProductDto extends PartialType(CreateProductDto) {}
```

### Task 2.4: Roles Decorator + Roles Guard

**Files:**
- Create: `back-end/src/common/decorators/roles.decorator.ts`
- Create: `back-end/src/common/guards/roles.guard.ts`

`roles.decorator.ts`:
```typescript
import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
```

`roles.guard.ts`:
```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user?.role);
  }
}
```

### Task 2.5: Upload Module (multer)

**Files:**
- Create: `back-end/src/modules/upload/upload.module.ts`
- Create: `back-end/src/modules/upload/upload.controller.ts`
- Create: `back-end/src/modules/upload/upload.service.ts`
- Modify: `back-end/src/main.ts` (serve static uploads)

`upload.service.ts`:
```typescript
import { Injectable, BadRequestException } from '@nestjs/common';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';

@Injectable()
export class UploadService {
  getUploadDir(): string {
    return join(process.cwd(), 'uploads');
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    if (!file) throw new BadRequestException('Không có file nào được upload');
    return `/uploads/${file.filename}`;
  }

  async removeFile(filename: string): Promise<void> {
    const filePath = join(process.cwd(), 'uploads', filename);
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
  }
}
```

`upload.controller.ts`:
```typescript
import { Controller, Post, Delete, Param, UseGuards, UseInterceptors, UploadedFile, UploadedFiles, MaxFileSizeValidator, ParseFilePipe, FileTypeValidator } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('upload')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class UploadController {
  constructor(private readonly service: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: join(process.cwd(), 'uploads'),
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
        cb(new BadRequestException('Chỉ chấp nhận file ảnh (jpg, jpeg, png, webp)'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 },
  }))
  async uploadImage(@UploadedFile(new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
      new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
    ],
  })) file: Express.Multer.File) {
    const url = await this.service.saveFile(file);
    return { url };
  }

  @Post('images')
  @UseInterceptors(FilesInterceptor('files', 5, {
    storage: diskStorage({
      destination: join(process.cwd(), 'uploads'),
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
  }))
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    const urls = await Promise.all(files.map(f => this.service.saveFile(f)));
    return { urls };
  }

  @Delete(':filename')
  async removeImage(@Param('filename') filename: string) {
    await this.service.removeFile(filename);
    return { message: 'Xóa ảnh thành công' };
  }
}
```

In `main.ts`, add before `await app.listen()`:
```typescript
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

// Change: const app = await NestFactory.create<NestExpressApplication>(AppModule);
app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' });
```

### Task 2.6: Frontend — Product Types + API

**Files:**
- Create: `front-end/src/types/product.type.ts`
- Create: `front-end/src/api/product.api.ts`
- Create: `front-end/src/api/category.api.ts`

`product.type.ts`:
```typescript
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice: number | null;
  quantity: number;
  sold: number;
  isActive: boolean;
  categoryId: string;
  category: Category;
  images: ProductImage[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  isThumbnail: boolean;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  price: number | null;
  quantity: number;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
  children: Category[];
}
```

`product.api.ts`: standard Axios API calls for products (getAll, getBySlug, getRelated)
`category.api.ts`: standard Axios API calls for categories (getAll, getBySlug)

### Task 2.7: Frontend — Product Components + Pages

**Files:**
- Create: `front-end/src/components/product/ProductCard.tsx`
- Create: `front-end/src/components/product/ProductGrid.tsx`
- Create: `front-end/src/components/product/ProductFilter.tsx`
- Create: `front-end/src/components/product/ProductSearch.tsx`
- Create: `front-end/src/pages/products/ProductListPage.tsx`
- Create: `front-end/src/pages/products/ProductDetailPage.tsx`
- Modify: `front-end/src/router/AppRouter.tsx`

ProductCard — shows product thumbnail, name, price, discount badge
ProductGrid — CSS grid of ProductCards
ProductFilter — sidebar with category tree, price range
ProductSearch — search input with debounce
ProductListPage — combines search + filter + grid with pagination
ProductDetailPage — full product detail with images, variants, add-to-cart

### Task 2.8: Frontend — Router Updates

Modify AppRouter.tsx to add:
```typescript
import { ProductListPage } from '../pages/products/ProductListPage';
import { ProductDetailPage } from '../pages/products/ProductDetailPage';

// Add routes:
<Route path="/products" element={<ProductListPage />} />
<Route path="/products/:slug" element={<ProductDetailPage />} />
```

### Task 2.9: Seed Product Data

**Files:**
- Create: `back-end/src/seeds/product.seed.ts`

Create a seed script that inserts:
- 5 categories (Điện thoại, Laptop, Tai nghe, Ốp lưng, Phụ kiện)
- 15+ products with sample data (images, prices, descriptions)
- Commit and add package.json script: `"seed:product": "ts-node -r tsconfig-paths/register src/seeds/product.seed.ts"`
