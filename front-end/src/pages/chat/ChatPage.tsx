import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { useAuthStore } from '../../store/auth.store';
import { Button } from '../../components/ui/Button';

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

    // Get or create room
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
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600">Vui lòng đăng nhập để sử dụng chat hỗ trợ</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h1 className="font-semibold">Hỗ trợ trực tuyến</h1>
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
        </div>

        <div className="h-[500px] overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <p className="text-center text-gray-400 py-16">Chưa có tin nhắn. Hãy gửi tin nhắn để bắt đầu!</p>
          )}
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-lg px-4 py-2 text-sm ${
                msg.senderId === user?.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
              }`}>
                <p>{msg.message}</p>
                <p className={`text-xs mt-1 ${msg.senderId === user?.id ? 'text-blue-200' : 'text-gray-400'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString('vi-VN')}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-gray-200 p-4 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Nhập tin nhắn..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button onClick={sendMessage} disabled={!input.trim()}>Gửi</Button>
        </div>
      </div>
    </div>
  );
}
