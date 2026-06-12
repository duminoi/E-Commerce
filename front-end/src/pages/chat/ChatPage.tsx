import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { useAuthStore } from '../../store/auth.store';
import { ROUTES } from '../../utils/constants';

interface Message {
  id: string;
  message: string;
  senderId: string;
  sender?: { id: string; fullName: string };
  createdAt: string;
}

export function ChatPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const token = localStorage.getItem('accessToken');
    const s = io('http://localhost:3000/chat', {
      auth: { token },
      transports: ['websocket'],
    });

    s.on('connect', () => setIsConnected(true));
    s.on('disconnect', () => setIsConnected(false));

    fetch('/api/chat/rooms', {
      headers: { Authorization: `Bearer ${token}` },
      method: 'POST',
    })
      .then(r => r.json())
      .then(data => {
        const room = data.data || data;
        setRoomId(room.id);
        s.emit('join-room', { roomId: room.id });

        fetch(`/api/chat/rooms/${room.id}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(r => r.json())
          .then(msgData => {
            const msgs = msgData.data?.items || msgData.items || [];
            setMessages(msgs);
          });
      })
      .catch(() => {});

    s.on('new-message', (msg: Message) => {
      setMessages(prev => [...prev, msg]);
    });

    setSocket(s);
    return () => { s.disconnect(); };
  }, [isAuthenticated, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !socket || !roomId || !user) return;
    socket.emit('send-message', { roomId, message: input.trim(), userId: user.id });
    setInput('');
  };

  if (!isAuthenticated) {
    return (
      <main className="flex-grow pt-[104px] pb-3xl flex items-center justify-center px-gutter">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">chat</span>
          <h2 className="font-h2 text-h2 text-on-surface mb-2">Đăng nhập để chat</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">
            Bạn cần đăng nhập để sử dụng tính năng hỗ trợ trực tuyến
          </p>
          <Link
            to={ROUTES.LOGIN}
            className="inline-flex items-center gap-2 bg-primary-container text-on-primary font-label-md py-3 px-8 rounded-xl hover:bg-blue-700 transition-colors"
          >
            <span className="material-symbols-outlined">login</span>
            Đăng nhập
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow pt-[104px] pb-3xl px-gutter max-w-max_width mx-auto w-full">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 font-caption text-caption text-on-surface-variant/70 mb-lg">
        <Link className="hover:text-primary transition-colors" to="/">Trang chủ</Link>
        <span>/</span>
        <span className="text-on-surface">Hỗ trợ trực tuyến</span>
      </nav>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(15,23,42,0.05)] overflow-hidden">
        {/* Chat Header */}
        <div className="px-lg py-md border-b border-outline-variant/30 bg-surface-container-low flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary">support_agent</span>
            </div>
            <div>
              <h2 className="font-label-md text-label-md text-on-surface font-semibold">Hỗ trợ trực tuyến</h2>
              <p className="text-caption text-on-surface-variant">
                {isConnected ? 'Đang kết nối' : 'Ngoại tuyến'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-tertiary-container' : 'bg-outline-variant'}`} />
            <span className="font-caption text-caption text-on-surface-variant">
              {isConnected ? 'Trực tuyến' : 'Ngoại tuyến'}
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="h-[500px] overflow-y-auto p-lg space-y-4 bg-surface-container-low/50">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">forum</span>
              <p className="font-body-md text-on-surface-variant">Chưa có tin nhắn</p>
              <p className="text-caption text-on-surface-variant/70 mt-1">Hãy gửi tin nhắn để bắt đầu!</p>
            </div>
          )}
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                msg.senderId === user?.id
                  ? 'bg-primary-container text-on-primary rounded-tr-sm'
                  : 'bg-surface-container-lowest border border-outline-variant/30 text-on-surface rounded-tl-sm'
              }`}>
                {msg.senderId !== user?.id && msg.sender?.fullName && (
                  <p className="font-caption text-xs font-medium text-primary mb-1">
                    {msg.sender.fullName}
                  </p>
                )}
                <p className="font-body-md text-sm">{msg.message}</p>
                <p className={`text-xs mt-1 ${
                  msg.senderId === user?.id ? 'text-on-primary/60' : 'text-on-surface-variant/60'
                }`}>
                  {new Date(msg.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-outline-variant/30 p-md flex gap-3 bg-surface-container-lowest">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Nhập tin nhắn..."
            className="flex-1 bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="w-12 h-12 rounded-full bg-primary-container text-on-primary flex items-center justify-center hover:bg-blue-700 transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </div>
    </main>
  );
}