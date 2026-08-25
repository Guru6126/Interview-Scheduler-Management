import api from './api';

export const notificationService = {
  getUserNotifications: async (userId) => {
    const response = await api.get(`/notifications/user/${userId}`);
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  sendNotification: async (data) => {
    const response = await api.post('/notifications', data);
    return response.data;
  }
};
