import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoom } from './entities/chat-room.entity';
import { ChatMessage } from './entities/chat-message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoom) private readonly roomRepo: Repository<ChatRoom>,
    @InjectRepository(ChatMessage) private readonly messageRepo: Repository<ChatMessage>,
  ) {}

  async createOrGetRoom(userId: string): Promise<ChatRoom> {
    let room = await this.roomRepo.findOne({ where: { userId, isActive: true }, relations: { user: true } });
    if (!room) {
      room = this.roomRepo.create({ userId, isActive: true });
      room = await this.roomRepo.save(room);
    }
    return room;
  }

  async getRooms(userId?: string): Promise<ChatRoom[]> {
    const where: any = { isActive: true };
    if (userId) where.userId = userId;
    return this.roomRepo.find({ where, relations: { user: true }, order: { updatedAt: 'DESC' } });
  }

  async getMessages(roomId: string, page = 1, limit = 50) {
    const [items, total] = await this.messageRepo.findAndCount({
      where: { roomId },
      relations: { sender: true },
      order: { createdAt: 'ASC' },
      skip: (page - 1) * limit, take: limit,
    });
    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async saveMessage(roomId: string, senderId: string, message: string): Promise<ChatMessage> {
    const msg = this.messageRepo.create({ roomId, senderId, message });
    const saved = await this.messageRepo.save(msg);
    await this.roomRepo.update(roomId, { lastMessage: message, updatedAt: new Date() });
    return this.messageRepo.findOneOrFail({ where: { id: saved.id }, relations: { sender: true } });
  }

  async markAsRead(roomId: string, userId: string) {
    await this.messageRepo.update({ roomId, senderId: userId, isRead: false }, { isRead: true });
  }
}
