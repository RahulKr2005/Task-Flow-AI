import axios from 'axios';

// Determine API base URL:
// 1. In production or custom setup, use VITE_API_URL from environment variable
// 2. In local development, connect to the TaskFlow AI backend on http://localhost:5000/api
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    const trimmed = envUrl.trim().replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
  }
  return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 45000, // 45 seconds for AI model generation and network latency
});

// Request interceptor to attach Auth Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('taskflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for clear, user-friendly error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred. Please try again.';
    let status = null;
    let code = null;

    if (!error.response) {
      // Check for timeout explicitly
      if (error.code === 'ECONNABORTED' || (error.message && error.message.toLowerCase().includes('timeout'))) {
        message = 'Request timed out. The AI service took longer than expected. Please try again.';
        code = 'TIMEOUT';
      } else {
        // Network error, server offline, or CORS issue
        message = 'Unable to connect to server. Please check your connection or ensure the backend server is running.';
        code = 'NETWORK_ERROR';
      }
    } else {
      status = error.response.status;
      const data = error.response.data;
      const serverMessage = data && typeof data === 'object' ? data.message : null;
      code = data && typeof data === 'object' ? data.code : null;

      const isAuthRoute =
        error.config?.url?.includes('/auth/login') ||
        error.config?.url?.includes('/auth/register');

      if (status === 401) {
        if (!isAuthRoute) {
          localStorage.removeItem('taskflow_token');
          message = serverMessage || 'Your session has expired. Please log in again.';
          code = code || 'AUTH_EXPIRED';
        } else {
          message = serverMessage || 'Invalid email or password';
        }
      } else if (serverMessage && typeof serverMessage === 'string') {
        const lower = serverMessage.toLowerCase();
        if (isAuthRoute && lower.includes('invalid credential')) {
          message = 'Invalid email or password';
        } else if (lower.includes('already exists') || lower.includes('already registered')) {
          message = 'Email already registered';
        } else {
          message = serverMessage;
        }
      } else if (status === 404) {
        message = 'Requested endpoint was not found on the server (404).';
      } else if (status === 400) {
        message = 'Invalid request. Please check your input.';
      } else if (status === 502 || status === 504) {
        message = 'Upstream AI service returned an invalid response. Please try again.';
      } else if (status === 503) {
        message = 'Service temporarily busy or initializing. Please wait a few seconds and try again.';
      } else if (status === 500) {
        message = 'Server encountered an error. Please try again later.';
      } else {
        message = 'Unable to complete request.';
      }
    }

    const customError = new Error(message);
    customError.status = status;
    customError.code = code;
    return Promise.reject(customError);
  }
);

export default api;
