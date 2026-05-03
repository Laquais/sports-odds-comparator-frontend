import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface User {
  id: number;
  email: string;
  created_at: string;
  is_active: boolean;
}

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(localStorage.getItem('access_token'));
  const refreshToken = ref<string | null>(localStorage.getItem('refresh_token'));
  const user = ref<User | null>(null);

  const isAuthenticated = computed(() => !!accessToken.value);

  async function register(email: string, password: string, passwordConfirm: string) {
    const response = await axios.post(`${API_URL}/auth/register`, {
      email,
      password,
      password_confirm: passwordConfirm,
    });
    return response.data;
  }

  async function login(email: string, password: string) {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });

    const { access_token, refresh_token } = response.data;

    accessToken.value = access_token;
    refreshToken.value = refresh_token;

    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);

    await fetchUser();
  }

  async function refresh() {
    if (!refreshToken.value) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${API_URL}/auth/refresh`, {
      refresh_token: refreshToken.value,
    });

    const { access_token, refresh_token } = response.data;

    accessToken.value = access_token;
    refreshToken.value = refresh_token;

    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
  }

  async function fetchUser() {
    if (!accessToken.value) return;

    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
    });

    user.value = response.data;
  }

  function logout() {
    accessToken.value = null;
    refreshToken.value = null;
    user.value = null;

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  if (accessToken.value) {
    fetchUser().catch(() => {
      logout();
    });
  }

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    register,
    login,
    refresh,
    fetchUser,
    logout,
  };
});
