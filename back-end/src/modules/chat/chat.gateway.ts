import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: '*' }, namespace: 'chat' })
export class ChatGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('join-room')
  async handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string }) {
    client.join(data.roomId);
    return { event: 'joined', data: { roomId: data.roomId } };
  }

  @SubscribeMessage('send-message')
  async handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string; message: string; userId: string }) {
    const message = await this.chatService.saveMessage(data.roomId, data.userId, data.message);
    this.server.to(data.roomId).emit('new-message', message);
    this.server.to(data.roomId).emit('typing', { userId: data.userId, isTyping: false });
    return message;
  }

  @SubscribeMessage('typing')
  handleTyping(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string; userId: string; isTyping: boolean }) {
    client.to(data.roomId).emit('typing', { userId: data.userId, isTyping: data.isTyping });
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string }) {
    client.leave(data.roomId);
  }
}
