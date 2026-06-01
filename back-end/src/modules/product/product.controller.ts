import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('products')
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Public()
  @Get()
  findAll(@Query() query: QueryProductDto) { return this.service.findAll(query); }

  @Public()
  @Get('related/:id')
  async findRelated(@Param('id') id: string) {
    const product = await this.service.findById(id);
    return this.service.findRelated(id, product.categoryId);
  }

  @Public()
  @Get(':slug')
  findBySlug(@Param('slug') slug: string) { return this.service.findBySlug(slug); }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateProductDto) { return this.service.create(dto); }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
