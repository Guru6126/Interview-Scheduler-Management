import api from './api';

export const availabilityService = {
  getAllAvailabilities: async () => {
    const response = await api.get('/availabilities');
    return response.data;
  },

  getAvailabilityById: async (id) => {
    const response = await api.get(`/availabilities/${id}`);
    return response.data;
  },

  getAvailabilityByInterviewer: async (interviewerId) => {
    const response = await api.get(`/availabilities/interviewer/${interviewerId}`);
    return response.data;
  },

  createAvailability: async (data) => {
    const response = await api.post('/availabilities', data);
    return response.data;
  },

  updateAvailability: async (id, data) => {
    const response = await api.put(`/availabilities/${id}`, data);
    return response.data;
  },

  deleteAvailability: async (id) => {
    const response = await api.delete(`/availabilities/${id}`);
    return response.data;
  }
};
