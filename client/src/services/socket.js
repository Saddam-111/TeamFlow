import { io } from 'socket.io-client';
import { useAuthStore } from '../store/auth.store';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    const token = useAuthStore.getState().accessToken;
    
    if (!token) {
      console.warn('No auth token available for socket connection');
      return;
    }

    if (this.socket?.connected) {
      console.log('Socket already connected');
      return this.socket;
    }

    const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 500,
      timeout: 15000,
      forceNew: true
    });

    this.socket.on('connect', () => {
      console.log('=== SOCKET CONNECTED ===', this.socket.id);
      const user = useAuthStore.getState().user;
      if (user?._id) {
        this.socket.emit('join-user-room', user._id);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('=== SOCKET DISCONNECTED ===');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    this.socket.on('new-message', (message) => {
      console.log('=== NEW MESSAGE RECEIVED ===', message);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
      this.listeners.set(event, callback);
    }
  }

  off(event) {
    if (this.socket && this.listeners.has(event)) {
      this.socket.off(event, this.listeners.get(event));
      this.listeners.delete(event);
    }
  }

  joinWorkspace(workspaceId) {
    this.emit('join-workspace', workspaceId);
  }

  leaveWorkspace(workspaceId) {
    this.emit('leave-workspace', workspaceId);
  }

  joinChannel(workspaceId, channelId) {
    console.log('Joining channel:', workspaceId, channelId);
    this.emit('join-workspace', workspaceId);
    this.emit('join-channel', { workspaceId, channelId });
  }

  leaveChannel(channelId) {
    this.emit('leave-channel', { channelId });
  }

  joinDocument(workspaceId, documentId) {
    this.emit('join-document', { workspaceId, documentId });
  }

  leaveDocument(documentId) {
    this.emit('leave-document', { documentId });
  }

  sendMessage(channelId, content, sender, replyTo, attachments = null, messageId = null) {
    const senderId = sender?._id || sender;
    this.emit('message', { channelId, content, sender, senderId, replyTo, attachments, messageId });
  }

  sendTyping(channelId, userId, username, isTyping) {
    this.emit('typing', { channelId, userId, username, isTyping });
  }

  sendMessageUpdate(channelId, messageId, content) {
    this.emit('message-update', { channelId, messageId, content });
  }

  sendMessageDelete(channelId, messageId) {
    this.emit('message-delete', { channelId, messageId });
  }

  sendMessageDelivered(channelId, messageId, userId) {
    this.emit('message-delivered', { channelId, messageId, userId });
  }

  sendMessageRead(channelId, messageId, userId) {
    this.emit('message-read', { channelId, messageId, userId });
  }

  updateDocument(documentId, content, cursorPosition, userId) {
    this.emit('document-update', { documentId, content, cursorPosition, userId });
  }

  updateTask(workspaceId, taskId, action, userId) {
    this.emit('task-update', { workspaceId, taskId, action, userId });
  }
}

export default new SocketService();