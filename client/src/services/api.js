import axios from 'axios';
import { useAuthStore } from '../store/auth.store';

const API_URL = import.meta.env.VITE_API_URL || '';
const BASE_URL = API_URL ? `${API_URL}/api` : '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const uploadAPI = {
  media: (formData) => api.post('/upload/media', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
};

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = useAuthStore.getState().refreshToken;
      
      if (refreshToken) {
        try {
          const refreshURL = API_URL ? `${API_URL}/api/auth/refresh` : '/api/auth/refresh';
          const response = await axios.post(refreshURL, {
            refreshToken
          });
          
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          useAuthStore.getState().setTokens(accessToken, newRefreshToken);
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          useAuthStore.getState().logout();
          window.location.href = '/auth/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken })
};

export const workspaceAPI = {
  create: (data) => api.post('/workspaces', data),
  getAll: () => api.get('/workspaces'),
  getById: (id) => api.get(`/workspaces/${id}`),
  update: (id, data) => api.put(`/workspaces/${id}`, data),
  join: (id, inviteCode) => api.post(`/workspaces/${id}/join`, { inviteCode }),
  leave: (id) => api.post(`/workspaces/${id}/leave`),
  removeMember: (id, memberId) => api.delete(`/workspaces/${id}/members/${memberId}`),
  regenerateCode: (id) => api.post(`/workspaces/${id}/regenerate-code`)
};

export const channelAPI = {
  create: (workspaceId, data) => api.post(`/workspaces/${workspaceId}/channels`, data),
  getAll: (workspaceId) => api.get(`/workspaces/${workspaceId}/channels`),
  getById: (workspaceId, id) => api.get(`/workspaces/${workspaceId}/channels/${id}`),
  update: (workspaceId, id, data) => api.put(`/workspaces/${workspaceId}/channels/${id}`, data),
  delete: (workspaceId, id) => api.delete(`/workspaces/${workspaceId}/channels/${id}`),
  getMessages: (workspaceId, id, params) => api.get(`/workspaces/${workspaceId}/channels/${id}/messages`, { params }),
  createMessage: (workspaceId, id, data) => api.post(`/workspaces/${workspaceId}/channels/${id}/messages`, data),
  updateMessage: (workspaceId, channelId, messageId, data) => api.put(`/workspaces/${workspaceId}/channels/${channelId}/messages/${messageId}`, data),
  deleteMessage: (workspaceId, channelId, messageId) => api.delete(`/workspaces/${workspaceId}/channels/${channelId}/messages/${messageId}`)
};

export const taskAPI = {
  create: (workspaceId, data) => api.post(`/workspaces/${workspaceId}/tasks`, data),
  getAll: (workspaceId, params) => api.get(`/workspaces/${workspaceId}/tasks`, { params }),
  getById: (workspaceId, id) => api.get(`/workspaces/${workspaceId}/tasks/${id}`),
  update: (workspaceId, id, data) => api.put(`/workspaces/${workspaceId}/tasks/${id}`, data),
  delete: (workspaceId, id) => api.delete(`/workspaces/${workspaceId}/tasks/${id}`),
  reorder: (workspaceId, data) => api.post(`/workspaces/${workspaceId}/tasks/reorder`, data)
};

export const documentAPI = {
  create: (workspaceId, data) => api.post(`/workspaces/${workspaceId}/documents`, data),
  getAll: (workspaceId) => api.get(`/workspaces/${workspaceId}/documents`),
  getById: (workspaceId, id) => api.get(`/workspaces/${workspaceId}/documents/${id}`),
  update: (workspaceId, id, data) => api.put(`/workspaces/${workspaceId}/documents/${id}`, data),
  delete: (workspaceId, id) => api.delete(`/workspaces/${workspaceId}/documents/${id}`),
  addCollaborator: (workspaceId, id, data) => api.post(`/workspaces/${workspaceId}/documents/${id}/collaborators`, data),
  removeCollaborator: (workspaceId, id, userId) => api.delete(`/workspaces/${workspaceId}/documents/${id}/collaborators/${userId}`)
};

export const notificationAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`)
};

export const searchAPI = {
  global: (params) => api.get('/search/global', { params })
};

export default api;
