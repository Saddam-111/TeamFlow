import notificationService from './notification.service.js';

class NotificationController {
  async getAll(req, res) {
    try {
      const { limit, unreadOnly } = req.query;
      const notifications = await notificationService.getNotificationsByUser(
        req.user.id,
        parseInt(limit) || 50,
        unreadOnly === 'true'
      );
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getUnreadCount(req, res) {
    try {
      const count = await notificationService.getUnreadCount(req.user.id);
      res.json({ count });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async markAsRead(req, res) {
    try {
      const notification = await notificationService.markAsRead(req.params.id, req.user.id);
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }
      res.json(notification);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async markAllAsRead(req, res) {
    try {
      await notificationService.markAllAsRead(req.user.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      await notificationService.deleteNotification(req.params.id, req.user.id);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new NotificationController();
