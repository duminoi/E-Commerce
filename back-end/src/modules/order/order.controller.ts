import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('orders')
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@CurrentUser() user: any, @Body() dto: CreateOrderDto) {
    return this.service.create(user.id, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findByUser(@CurrentUser() user: any, @Query('page') page = 1, @Query('limit') limit = 10) {
    return this.service.findByUser(user.id, +page, +limit);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.service.findAll(+page, +limit);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findById(@CurrentUser() user: any, @Param('id') id: string) {
    return this.service.findById(id, user.role === Role.ADMIN ? undefined : user.id);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  cancel(@CurrentUser() user: any, @Param('id') id: string, @Body('reason') reason?: string) {
    return this.service.cancel(id, user.id, reason);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.service.updateStatus(id, dto.status);
  }
}
