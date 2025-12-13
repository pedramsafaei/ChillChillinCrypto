import axios from 'axios';

// Create axios instance with default config
const axiosInstance = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    config.params = {
      ...config.params,
      _t: Date.now(),
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Retry logic for failed requests
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

        if (originalRequest._retryCount <= 3) {
          // Exponential backoff
          const delay = Math.pow(2, originalRequest._retryCount) * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));
          return axiosInstance(originalRequest);
        }
      }
    }

    // Handle specific error codes
    if (error.response) {
      switch (error.response.status) {
        case 429:
          // Rate limit exceeded
          console.error('Rate limit exceeded. Please try again later.');
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          console.error('Server error. Please try again later.');
          break;
        default:
          console.error('An error occurred:', error.response.data);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
