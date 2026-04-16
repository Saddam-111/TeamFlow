import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import userService from '../modules/user/user.service.js';
import notificationService from '../modules/notification/notification.service.js';

class SocketService {
  constructor() {
    this.io = null;
    this.userSockets = new Map();
  }

  initialize(server) {
    const corsOrigin = Array.isArray(config.cors.origin) ? config.cors.origin : [config.cors.origin];
    
    this.io = new Server(server, {
      cors: {
        origin: corsOrigin,
        credentials: true,
        methods: ['GET', 'POST']
      }
    });

    this.io.use(this.authenticate.bind(this));
    this.io.on('connection', this.handleConnection.bind(this));

    this.setupNamespaces();
    
    console.log('Socket.IO initialized');
    return this.io;
  }

  authenticate(socket, next) {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      socket.user = decoded;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  }

  async handleConnection(socket) {
    console.log(`User connected: ${socket.user.id}`);

    await userService.updateOnlineStatus(socket.user.id, true);
    this.userSockets.set(socket.user.id, socket.id);

    socket.join(`user:${socket.user.id}`);

    const user = await userService.findUserById(socket.user.id);
    socket.emit('connected', { userId: socket.user.id, username: user?.username });
    
    this.io.emit('user-online', {
      userId: socket.user.id,
      username: user?.username
    });

    socket.on('join-workspace', async (workspaceId) => {
      socket.join(`workspace:${workspaceId}`);
    });

    socket.on('leave-workspace', (workspaceId) => {
      socket.leave(`workspace:${workspaceId}`);
    });

    socket.on('join-channel', ({ workspaceId, channelId }) => {
      socket.join(`channel:${channelId}`);
      socket.to(`channel:${channelId}`).emit('user-joined-channel', {
        userId: socket.user.id,
        channelId
      });
    });

    socket.on('leave-channel', ({ channelId }) => {
      socket.leave(`channel:${channelId}`);
    });

    socket.on('join-document', ({ workspaceId, documentId }) => {
      socket.join(`document:${documentId}`);
      socket.to(`document:${documentId}`).emit('user-joined-document', {
        userId: socket.user.id,
        documentId
      });
    });

    socket.on('leave-document', ({ documentId }) => {
      socket.leave(`document:${documentId}`);
    });

    socket.on('message', (data) => this.handleMessage.bind(this)(data, socket));
    socket.on('typing', this.handleTyping.bind(this));
    socket.on('message-update', (data) => this.handleMessageUpdated.bind(this)(data, socket));
    socket.on('message-delete', (data) => this.handleMessageDeleted.bind(this)(data, socket));
    socket.on('document-update', this.handleDocumentUpdate.bind(this));
    socket.on('task-update', this.handleTaskUpdate.bind(this));
    socket.on('message-delivered', (data) => this.handleMessageDelivered.bind(this)(data, socket));
    socket.on('message-read', (data) => this.handleMessageRead.bind(this)(data, socket));

    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.user.id}`);
      const username = (await userService.findUserById(socket.user.id))?.username;
      await userService.updateOnlineStatus(socket.user.id, false);
      this.userSockets.delete(socket.user.id);
      
      this.io.emit('user-offline', { userId: socket.user.id, username });
    });
  }

  setupNamespaces() {
    this.io.of('/api').on('connection', (socket) => {
      console.log('API namespace connection');
    });
  }

  handleMessage(data, socket) {
    console.log('=== HANDLE MESSAGE ===');
    console.log('Data:', data);
    console.log('Socket user:', socket.user.id);
    const { channelId, content, sender, senderId, replyTo, attachments, messageId } = data;
    const channelRoom = `channel:${channelId}`;
    console.log('Broadcasting to room:', channelRoom, 'including sender');
    this.io.in(channelRoom).emit('new-message', {
      channelId,
      content,
      sender,
      senderId,
      replyTo,
      attachments,
      messageId,
      status: 'sent',
      createdAt: new Date()
    });
  }

  async handleTyping(data) {
    const { channelId, userId, isTyping } = data;
    const user = await userService.findUserById(userId);
    this.io.in(`channel:${channelId}`).emit('user-typing', {
      channelId,
      userId,
      username: user?.username,
      isTyping
    });
  }

  handleMessageUpdated(data, socket) {
    const { channelId, messageId, content } = data;
    this.io.in(`channel:${channelId}`).emit('message-updated', {
      channelId,
      messageId,
      content
    });
  }

  handleMessageDeleted(data, socket) {
    const { channelId, messageId } = data;
    this.io.in(`channel:${channelId}`).emit('message-deleted', {
      channelId,
      messageId
    });
  }

  handleMessageDelivered(data, socket) {
    const { channelId, messageId, userId } = data;
    this.io.in(`channel:${channelId}`).emit('message-status-updated', {
      channelId,
      messageId,
      status: 'delivered',
      userId
    });
  }

  handleMessageRead(data, socket) {
    const { channelId, messageId, userId } = data;
    this.io.in(`channel:${channelId}`).emit('message-status-updated', {
      channelId,
      messageId,
      status: 'read',
      userId
    });
  }

  handleDocumentUpdate(data) {
    const { documentId, content, cursorPosition, userId } = data;
    this.io.to(`document:${documentId}`).emit('document-changed', {
      documentId,
      content,
      cursorPosition,
      userId
    });
  }

  handleTaskUpdate(data) {
    const { workspaceId, taskId, action, userId } = data;
    this.io.to(`workspace:${workspaceId}`).emit('task-updated', {
      taskId,
      action,
      userId
    });
  }

  emitToUser(userId, event, data) {
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
    }
  }

  emitToWorkspace(workspaceId, event, data) {
    this.io.to(`workspace:${workspaceId}`).emit(event, data);
  }

  emitToChannel(channelId, event, data) {
    this.io.to(`channel:${channelId}`).emit(event, data);
  }

  emitNotification(userId, notification) {
    this.io.to(`user:${userId}`).emit('notification', notification);
  }
}

export default new SocketService();