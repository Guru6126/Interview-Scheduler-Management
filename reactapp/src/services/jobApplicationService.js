import api from './api';

export const jobApplicationService = {
  getAllApplications: async () => {
    const response = await api.get('/job-applications');
    return response.data;
  },

  getApplicationById: async (id) => {
    const response = await api.get(`/job-applications/${id}`);
    return response.data;
  },

  applyToJob: async (data) => {
    const response = await api.post('/job-applications', data);
    return response.data;
  },

  updateApplicationStatus: async (id, status) => {
    const response = await api.patch(`/job-applications/${id}/status`, null, {
      params: { status }
    });
    return response.data;
  },

  getApplicationsByJob: async (jobId) => {
    const response = await api.get(`/job-applications/job/${jobId}`);
    return response.data;
  }
};
