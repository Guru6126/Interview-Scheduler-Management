import api from './api'; // Import your pre-configured Axios instance

export const candidateService = {
  // Fetch all candidates
  getAllCandidates: async () => {
    const response = await api.get('/candidates');
    return response.data;
  },

  // Fetch a single candidate by ID
  getCandidateById: async (id) => {
    const response = await api.get(`/candidates/${id}`);
    return response.data;
  },

  // Create a new candidate (Admin / Recruiter)
  createCandidate: async (candidateData) => {
    const response = await api.post('/candidates', candidateData);
    return response.data;
  },

  // Update an existing candidate (Admin / Recruiter)
  updateCandidate: async (id, candidateData) => {
    const response = await api.put(`/candidates/${id}`, candidateData);
    return response.data;
  },

  // Delete a candidate (Admin only)
  deleteCandidate: async (id) => {
    const response = await api.delete(`/candidates/${id}`);
    return response.data;
  }
};