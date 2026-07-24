import axios from 'axios';

export const API_BASE = 'https://api.freenoo.com/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor
apiClient.interceptors.request.use(
  config => config,
  error => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const { config, response } = error;
    // Retry on network error up to 3 times
    if (!response && config && !config._retry) {
      config._retry = true;
      config._retryCount = (config._retryCount || 0) + 1;
      if (config._retryCount <= 3) {
        await new Promise(r => setTimeout(r, 1000 * config._retryCount));
        return apiClient(config);
      }
    }
    return Promise.reject(error);
  }
);
