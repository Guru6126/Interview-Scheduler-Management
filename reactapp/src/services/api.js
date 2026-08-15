import axios from 'axios';

// Create an Axios instance with your Spring Boot backend base URL
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Adjust if your backend uses a different port or context path
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Automatically attach the JWT token to outgoing requests if available
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global errors (like 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // if unauthorized, clear user data and redirect to login
    if (error.response && error.response.status === 401) {
      // Token expired or invalid: clear storage and redirect to login
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;