import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ChatMessage } from './chat-message.entity';

@Entity('chat_rooms')
export class ChatRoom {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ name: 'user_id' }) userId: string;
  @ManyToOne(() => User) @JoinColumn({ name: 'user_id' }) user: User;

  @Column({ name: 'admin_id', nullable: true }) adminId: string;
  @ManyToOne(() => User) @JoinColumn({ name: 'admin_id' }) admin: User;

  @Column({ name: 'is_active', default: true }) isActive: boolean;
  @Column({ name: 'last_message', nullable: true }) lastMessage: string;

  @OneToMany(() => ChatMessage, (m) => m.room) messages: ChatMessage[];
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}
