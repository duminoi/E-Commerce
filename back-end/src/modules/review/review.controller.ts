import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto, UpdateReviewDto } from './dto/create-review.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly service: ReviewService) {}

  @Public()
  @Get('product/:id')
  findByProduct(@Param('id') id: string, @Query('page') page = 1, @Query('limit') limit = 10) {
    return this.service.findByProduct(id, +page, +limit);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@CurrentUser() user: any, @Body() dto: CreateReviewDto) { return this.service.create(user.id, dto); }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: UpdateReviewDto) { return this.service.update(id, user.id, dto); }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@CurrentUser() user: any, @Param('id') id: string) { return this.service.remove(id, user.id); }
}
