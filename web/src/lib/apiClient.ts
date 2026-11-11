import axios from 'axios';
import { friendlyApiError } from './apiErrors';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 30_000,
});

// Response interceptor — unwrap { success, data } envelope
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    return Promise.reject(new Error(friendlyApiError(err.response?.status, err.response?.data)));
  },
);

export { API_BASE };
