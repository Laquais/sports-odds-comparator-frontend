import axios from 'axios';
import { useAuthStore } from '../stores/auth';
import router from '../router';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    if (authStore.accessToken) {
      config.headers.Authorization = `Bearer ${authStore.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const authStore = useAuthStore();

      if (authStore.refreshToken) {
        try {
          await authStore.refresh();

          if (authStore.accessToken) {
            originalRequest.headers.Authorization = `Bearer ${authStore.accessToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          authStore.logout();
          router.push('/login');
          return Promise.reject(refreshError);
        }
      } else {
        authStore.logout();
        router.push('/login');
      }
    }

    return Promise.reject(error);
  }
);

export default api;
