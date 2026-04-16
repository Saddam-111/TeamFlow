import Message from './message.model.js';
import Workspace from '../workspace/workspace.model.js';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

class MessageService {
  async createMessage(data) {
    try {
      const message = await Message.create(data);
      return this.getMessageById(message._id);
    } catch (error) {
      console.error('Message create error:', error.message);
      if (error.code === 11000) {
        throw new Error('Duplicate message detected. Please try again.');
      }
      throw error;
    }
  }

  async getMessageById(id) {
    return Message.findById(id)
      .populate('sender', 'username avatar')
      .populate('replyTo', 'content sender');
  }

  async getMessagesByChannel(channelId, limit = 50, before = null) {
    const query = { channel: channelId };
    if (before) {
      query.createdAt = { $lt: before };
    }
    return Message.find(query)
      .sort({ createdAt: 1 })
      .limit(limit)
      .populate('sender', 'username avatar')
      .populate('replyTo', 'content sender')
      .lean();
  }

  async updateMessage(messageId, userId, content) {
    const message = await Message.findById(messageId);
    
    if (!message) {
      throw new Error('Message not found');
    }

    // Only sender can edit their own message
    if (message.sender.toString() !== userId.toString()) {
      throw new Error('You can only edit your own messages');
    }

    message.content = content;
    message.isEdited = true;
    message.editedAt = new Date();
    
    return message.save();
  }

  async deleteMessage(messageId, userId, workspaceId = null) {
    const message = await Message.findById(messageId);
    
    if (!message) {
      throw new Error('Message not found');
    }

    let isWorkspaceOwner = false;
    if (workspaceId) {
      const workspace = await Workspace.findById(workspaceId);
      if (workspace && workspace.owner.toString() === userId.toString()) {
        isWorkspaceOwner = true;
      }
    }

    if (message.sender.toString() !== userId.toString() && !isWorkspaceOwner) {
      throw new Error('You can only delete your own messages');
    }

    if (message.attachments && message.attachments.length > 0) {
      console.log('Deleting attachments:', message.attachments);
      for (const url of message.attachments) {
        try {
          const publicIdMatch = url.match(/teamFlow\/assets\/([^.]+)/);
          if (publicIdMatch) {
            const publicId = publicIdMatch[1];
            console.log('Deleting from Cloudinary, publicId:', publicId);
            await cloudinary.v2.uploader.destroy(publicId);
          }
        } catch (err) {
          console.error('Error deleting from Cloudinary:', err);
        }
      }
    }

    await Message.findByIdAndDelete(messageId);
    return { success: true };
  }

  async addReaction(messageId, userId, emoji) {
    const message = await Message.findById(messageId);
    
    if (!message) {
      throw new Error('Message not found');
    }

    return message.addReaction(userId, emoji);
  }

  async searchMessages(query, workspaceId) {
    return Message.find({
      content: { $regex: query, $options: 'i' }
    }).populate('sender', 'username avatar').limit(50);
  }
}

export default new MessageService();