import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ChatRoom } from './chat-room.entity';
import { User } from '../../user/entities/user.entity';

@Entity('chat_messages')
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ name: 'room_id' }) roomId: string;
  @ManyToOne(() => ChatRoom, (r) => r.messages, { onDelete: 'CASCADE' }) @JoinColumn({ name: 'room_id' }) room: ChatRoom;

  @Column({ name: 'sender_id' }) senderId: string;
  @ManyToOne(() => User) @JoinColumn({ name: 'sender_id' }) sender: User;

  @Column({ type: 'text' }) message: string;
  @Column({ name: 'is_read', default: false }) isRead: boolean;

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
}
