import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly service: ChatService) {}

  @Post('rooms')
  getOrCreateRoom(@CurrentUser() user: any) { return this.service.createOrGetRoom(user.id); }

  @Get('rooms')
  getRooms(@CurrentUser() user: any) { return this.service.getRooms(user.id); }

  @Get('rooms/:id/messages')
  getMessages(@Param('id') id: string, @Query('page') page = 1, @Query('limit') limit = 50) {
    return this.service.getMessages(id, +page, +limit);
  }
}
