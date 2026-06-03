import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: any) {
    return this.userService.findById(user.id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@CurrentUser() user: any, @Body() dto: UpdateUserDto) {
    return this.userService.update(user.id, dto);
  }

  @Get('addresses')
  @UseGuards(JwtAuthGuard)
  async getAddresses(@CurrentUser() user: any) {
    return this.userService.findAddresses(user.id);
  }

  @Post('addresses')
  @UseGuards(JwtAuthGuard)
  async createAddress(@CurrentUser() user: any, @Body() dto: any) {
    return this.userService.createAddress(user.id, dto);
  }

  @Patch('addresses/:id')
  @UseGuards(JwtAuthGuard)
  async updateAddress(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: any) {
    return this.userService.updateAddress(user.id, id, dto);
  }

  @Patch('addresses/:id/default')
  @UseGuards(JwtAuthGuard)
  async setDefaultAddress(@CurrentUser() user: any, @Param('id') id: string) {
    return this.userService.setDefaultAddress(user.id, id);
  }

  @Delete('addresses/:id')
  @UseGuards(JwtAuthGuard)
  async deleteAddress(@CurrentUser() user: any, @Param('id') id: string) {
    return this.userService.deleteAddress(user.id, id);
  }
}
