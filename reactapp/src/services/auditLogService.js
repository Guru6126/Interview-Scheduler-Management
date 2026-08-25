import api from './api';

export const auditLogService = {
  getAllLogs: async () => {
    const response = await api.get('/audit-logs');
    return response.data;
  },

  getLogsByUser: async (userId) => {
    const response = await api.get(`/audit-logs/user/${userId}`);
    return response.data;
  },

  getLogsByEntity: async (entityType, entityId) => {
    const response = await api.get(`/audit-logs/entity/${entityType}/${entityId}`);
    return response.data;
  }
};
