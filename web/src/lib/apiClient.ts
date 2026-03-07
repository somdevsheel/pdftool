import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 30_000,
});

// Response interceptor — unwrap { success, data } envelope
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message ||
      err.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  },
);

export { API_BASE };
