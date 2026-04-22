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
        className="relative p-2 hover:bg-white/[0.06] transition-colors rounded-lg"
      >
        <span className="text-lg">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-lime-accent text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 sm:w-72 glass border border-white/10 z-50 shadow-xl">
          <div className="p-3 border-b border-white/[0.06] flex items-center justify-between">
            <h3 className="font-bold uppercase tracking-wider text-xs sm:text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-[10px] sm:text-xs text-lime-accent hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-80 overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-white/30 text-xs">No notifications</div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
                  className={`p-3 border-b border-white/[0.06] cursor-pointer hover:bg-white/[0.06] transition-colors ${
                    !notification.isRead ? 'bg-lime-accent/5' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs truncate">{notification.title}</p>
                      {notification.content && (
                        <p className="text-white/40 text-[10px] sm:text-xs mt-0.5 truncate">{notification.content}</p>
                      )}
                      <p className="text-white/20 text-[10px] mt-1 font-mono">
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