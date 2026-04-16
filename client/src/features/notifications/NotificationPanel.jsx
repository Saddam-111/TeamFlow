import { useState, useEffect } from 'react';
import { useNotificationStore } from '../../store/notification.store';
import { notificationAPI } from '../../services/api';
import socketService from '../../services/socket';

export function NotificationPanel() {
  const { notifications, setNotifications, unreadCount, setUnreadCount, markAsRead, markAllAsRead, addNotification } = useNotificationStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
    
    const handleNewNotification = (notification) => {
      addNotification(notification);
      setUnreadCount(prev => prev + 1);
    };
    
    socketService.on('notification', handleNewNotification);
    return () => socketService.off('notification');
  }, [addNotification, setUnreadCount]);

  const loadNotifications = async () => {
    try {
      const response = await notificationAPI.getAll();
      setNotifications(response.data || []);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await notificationAPI.getUnreadCount();
      setUnreadCount(response.data.count);
    } catch (err) {
      console.error('Failed to load unread count:', err);
    }
  };

  const handleNewNotification = (notification) => {
    addNotification(notification);
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      markAsRead(id);
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      markAllAsRead();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      message: '💬',
      mention: '@',
      task_assigned: '✅',
      task_updated: '📝',
      document_shared: '📄',
      workspace_invite: '🏢',
      reaction: '👍'
    };
    return icons[type] || '🔔';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-surface-light transition-colors"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-acid-yellow text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 md:w-80 bg-surface border border-surface-light z-50">
          <div className="p-4 border-b border-surface-light flex items-center justify-between">
            <h3 className="font-bold uppercase tracking-wider">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-acid-yellow hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No notifications</div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
                  className={`p-4 border-b border-surface-light cursor-pointer hover:bg-surface-light transition-colors ${
                    !notification.isRead ? 'bg-surface-light/50' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <span className="text-xl">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1">
                      <p className="font-bold text-sm">{notification.title}</p>
                      {notification.content && (
                        <p className="text-gray-400 text-xs mt-1">{notification.content}</p>
                      )}
                      <p className="text-gray-500 text-xs mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
