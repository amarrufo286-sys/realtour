// client/src/lib/socket.js
import { io } from 'socket.io-client';

let socket = null;

export function connectSocket({ baseUrl, userId }) {
  socket = io(baseUrl, { path: '/ws', auth: { userId } });
  return socket;
}

export function getSocket() {
  if (!socket) throw new Error('Socket not connected');
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
