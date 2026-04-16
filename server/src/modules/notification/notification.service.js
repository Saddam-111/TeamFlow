import Notification from './notification.model.js';

class NotificationService {
  async createNotification(data) {
    const notification = await Notification.create(data);
    return this.getNotificationById(notification._id);
  }

  async getNotificationById(id) {
    return Notification.findById(id).populate('sender', 'username avatar');
  }

  async getNotificationsByUser(userId, limit = 50, unreadOnly = false) {
    const query = { recipient: userId };
    if (unreadOnly) {
      query.isRead = false;
    }
    return Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('sender', 'username avatar');
  }

  async markAsRead(notificationId, userId) {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { isRead: true },
      { new: true }
    );
    return notification;
  }

  async markAllAsRead(userId) {
    return Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true }
    );
  }

  async deleteNotification(notificationId, userId) {
    return Notification.findOneAndDelete({
      _id: notificationId,
      recipient: userId
    });
  }

  async getUnreadCount(userId) {
    return Notification.countDocuments({ recipient: userId, isRead: false });
  }

  async createNotificationAndEmit(io, data) {
    const notification = await this.getNotificationById((await this.createNotification(data))._id);
    if (io) {
      io.to(`user:${data.recipient}`).emit('notification', notification);
    }
    return notification;
  }
}

export default new NotificationService();
