import { create } from 'zustand';

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  
  setNotifications: (notifications) => set({ notifications }),
  
  setUnreadCount: (count) => set({ unreadCount: count }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  addNotification: (notification) => set((state) => ({ 
    notifications: [notification, ...state.notifications],
    unreadCount: notification.isRead ? state.unreadCount : state.unreadCount + 1
  })),
  
  markAsRead: (notificationId) => set((state) => ({
    notifications: state.notifications.map(n => 
      n._id === notificationId ? { ...n, isRead: true } : n
    ),
    unreadCount: Math.max(0, state.unreadCount - 1)
  })),
  
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, isRead: true })),
    unreadCount: 0
  })),
  
  removeNotification: (notificationId) => set((state) => {
    const notification = state.notifications.find(n => n._id === notificationId);
    return {
      notifications: state.notifications.filter(n => n._id !== notificationId),
      unreadCount: notification && !notification.isRead 
        ? Math.max(0, state.unreadCount - 1) 
        : state.unreadCount
    };
  })
}));
