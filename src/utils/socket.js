import { io } from 'socket.io-client';

// Allow runtime configuration via window or localStorage
const getSocketUrl = () => {
  if (typeof window !== 'undefined' && window.__SOCKET_URL__) {
    return window.__SOCKET_URL__;
  }
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('socket_server_url');
    if (stored) return stored;
  }
  return import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
};

let socket = null;

export const connectSocket = () => {
  const currentUrl = getSocketUrl();
  
  // If socket exists but URL changed, disconnect and recreate
  if (socket && socket.io && socket.io.uri !== currentUrl.replace(/^http/, 'ws')) {
    socket.disconnect();
    socket = null;
  }
  
  if (!socket) {
    socket = io(currentUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: Infinity, // Keep trying to reconnect
      timeout: 5000,
      forceNew: false,
    });
  } else if (!socket.connected) {
    socket.connect();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => {
  if (!socket) {
    return connectSocket();
  }
  return socket;
};
