import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users';

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  };
};

export const userService = {
  getAllUsers: async () => {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
  },

  getUserById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
  },

  createUser: async (userData) => {
    const response = await axios.post(API_URL, userData, getAuthHeaders());
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await axios.put(`${API_URL}/${id}`, userData, getAuthHeaders());
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
  }
};