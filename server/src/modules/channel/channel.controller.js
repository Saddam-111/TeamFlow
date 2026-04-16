import channelService from './channel.service.js';
import messageService from '../message/message.service.js';
import notificationService from '../notification/notification.service.js';
import socketService from '../../services/socket.service.js';

function excludeSender(io, channelId, event, data) {
  io.in(`channel:${channelId}`).except(`user:${data.senderId}`).emit(event, data);
}

class ChannelController {
  async create(req, res) {
    try {
      console.log('=== CREATE CHANNEL DEBUG ===');
      console.log('workspaceId from params:', req.params.workspaceId);
      console.log('user from token:', req.user);
      console.log('body:', req.body);
      
      const { name, type, description } = req.body;
      
      if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'Channel name is required' });
      }
      
      const channel = await channelService.createChannel(req.params.workspaceId, req.user.id, {
        name: name.trim(),
        type: type || 'text',
        description
      });
      res.status(201).json(channel);
    } catch (error) {
      console.log('Error creating channel:', error.message);
      res.status(400).json({ message: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const channels = await channelService.getChannelsByWorkspace(req.params.workspaceId);
      res.json(channels);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const channel = await channelService.getChannelById(req.params.id);
      if (!channel) {
        return res.status(404).json({ message: 'Channel not found' });
      }
      res.json(channel);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const channel = await channelService.updateChannel(req.params.id, req.body);
      if (!channel) {
        return res.status(404).json({ message: 'Channel not found' });
      }
      res.json(channel);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      await channelService.deleteChannel(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getMessages(req, res) {
    try {
      const { limit, before } = req.query;
      const messages = await messageService.getMessagesByChannel(
        req.params.id,
        parseInt(limit) || 50,
        before
      );
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createMessage(req, res) {
    try {
      const { content, replyTo, attachments } = req.body;
      
      if (!content?.trim() && (!attachments || attachments.length === 0)) {
        return res.status(400).json({ message: 'Message must have content or attachments' });
      }
      
      const channel = await channelService.getChannelById(req.params.id);
      if (!channel) {
        return res.status(404).json({ message: 'Channel not found' });
      }
      
      const message = await messageService.createMessage({
        content,
        channel: req.params.id,
        sender: req.user.id,
        replyTo,
        attachments
      });

      const workspaceMembers = channel.workspace?.members?.map(m => m.user.toString()) || [];
      const notifyPromises = workspaceMembers
        .filter(userId => userId !== req.user.id)
        .map(userId => 
          notificationService.createNotificationAndEmit(socketService.io, {
            recipient: userId,
            sender: req.user.id,
            type: 'message',
            title: 'New Message',
            content: content?.substring(0, 50),
            link: `/workspace/${req.params.workspaceId}/channels/${req.params.id}`
          })
        );
      await Promise.all(notifyPromises);

      res.status(201).json(message);
    } catch (error) {
      console.error('Error creating message:', error.message);
      res.status(400).json({ message: error.message });
    }
  }

  async updateMessage(req, res) {
    try {
      const { content } = req.body;
      const message = await messageService.updateMessage(
        req.params.messageId,
        req.user.id,
        content
      );
      
      excludeSender(socketService.io, req.params.id, 'message-updated', {
        channelId: req.params.id,
        messageId: req.params.messageId,
        content,
        senderId: req.user.id
      });
      
      res.json(message);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteMessage(req, res) {
    try {
      const message = await messageService.getMessageById(req.params.messageId);
      await messageService.deleteMessage(req.params.messageId, req.user.id, req.params.workspaceId);
      
      excludeSender(socketService.io, req.params.id, 'message-deleted', {
        channelId: req.params.id,
        messageId: req.params.messageId,
        senderId: req.user.id
      });
      
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new ChannelController();