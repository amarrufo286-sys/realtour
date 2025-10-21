// client/src/context/ChatProvider.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { connectSocket, getSocket } from '../lib/socket';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const meRef = useRef('');

  const connect = (userId, wsBase) => {
    meRef.current = userId;
    const s = connectSocket({ baseUrl: wsBase, userId });
    s.on('message:new', (msg) => setMessages((m) => [...m, msg]));
    s.on('message:read', ({ _id, readAt }) =>
      setMessages((m) => m.map((x) => (x._id === _id ? { ...x, readAt } : x)))
    );
  };

  const send = (receiverId, text) => {
    return new Promise((resolve) => {
      const s = getSocket();
      s.emit('message:send', { receiverId, text }, (ack) => resolve(ack));
    });
  };

  const clear = () => setMessages([]);

  useEffect(() => () => setMessages([]), []);

  return (
    <ChatContext.Provider value={{ messages, connect, send, clear }}>
      {children}
    </ChatContext.Provider>
  );
};

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
}
