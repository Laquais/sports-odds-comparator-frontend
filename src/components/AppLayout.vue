<template>
  <div class="min-h-screen bg-gray-950">
    <header class="bg-gray-900 border-b border-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <div class="flex items-center space-x-12">
            <router-link to="/" class="flex items-center space-x-3 group">
              <div class="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 9a1 1 0 112 0v4a1 1 0 11-2 0V9zm2-3a1 1 0 100 2 1 1 0 000-2z"/>
                </svg>
              </div>
              <span class="text-xl font-bold text-white group-hover:text-primary-400 transition">OddsCompare</span>
            </router-link>
            <nav class="hidden md:flex space-x-2">
              <router-link
                to="/"
                class="px-4 py-2 rounded-lg text-sm font-semibold text-gray-400 hover:text-white hover:bg-gray-800 transition"
                active-class="text-primary-400 bg-gray-800 hover:text-primary-300"
              >
                Accueil
              </router-link>
              <router-link
                to="/sports"
                class="px-4 py-2 rounded-lg text-sm font-semibold text-gray-400 hover:text-white hover:bg-gray-800 transition"
                active-class="text-primary-400 bg-gray-800 hover:text-primary-300"
              >
                Sports
              </router-link>
              <router-link
                to="/explorer"
                class="px-4 py-2 rounded-lg text-sm font-semibold text-gray-400 hover:text-white hover:bg-gray-800 transition"
                active-class="text-primary-400 bg-gray-800 hover:text-primary-300"
              >
                Explorer
              </router-link>
              <router-link
                to="/freebets"
                class="px-4 py-2 rounded-lg text-sm font-semibold text-gray-400 hover:text-white hover:bg-gray-800 transition"
                active-class="text-primary-400 bg-gray-800 hover:text-primary-300"
              >
                Freebets
              </router-link>
            </nav>
          </div>
          <div class="flex items-center space-x-4">
            <div v-if="authStore.user" class="hidden sm:flex items-center space-x-3 px-3 py-2 rounded-lg bg-gray-800">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <span class="text-xs font-bold text-white">{{ getUserInitial }}</span>
              </div>
              <span class="text-sm font-medium text-gray-300">{{ authStore.user.email }}</span>
            </div>
            <button
              @click="handleLogout"
              class="px-4 py-2 bg-gray-800 text-gray-300 text-sm font-semibold rounded-lg hover:bg-gray-700 transition flex items-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              <span class="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="py-12">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const getUserInitial = computed(() => {
  return authStore.user?.email.charAt(0).toUpperCase() || 'U';
});

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>
