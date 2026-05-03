<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-white mb-4">
          Sélectionnez un sport
        </h1>
        <p class="text-lg text-gray-400">
          Choisissez le sport pour lequel vous souhaitez comparer les cotes
        </p>
      </div>

      <div class="mb-8">
        <div class="relative max-w-xl mx-auto">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            class="block w-full pl-12 pr-4 py-3.5 border border-gray-700 rounded-xl bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            placeholder="Rechercher un sport..."
          />
        </div>
      </div>

      <div v-if="loading" class="text-center py-20">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
          <svg class="animate-spin h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p class="text-gray-400">Chargement des sports...</p>
      </div>

      <div v-else-if="error" class="max-w-md mx-auto">
        <div class="rounded-xl bg-red-50 border border-red-200 p-6">
          <div class="flex items-start">
            <svg class="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
            <div>
              <h3 class="text-sm font-semibold text-red-800 mb-1">Erreur de chargement</h3>
              <p class="text-sm text-red-700">{{ error }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="filteredSports.length === 0" class="text-center py-20">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
          <svg class="h-8 w-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-300 mb-2">Aucun sport trouvé</h3>
        <p class="text-gray-400">Essayez une autre recherche</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <router-link
          v-for="sport in filteredSports"
          :key="sport.id"
          :to="`/sports/${sport.id}/matches`"
          class="group relative bg-gray-900 rounded-2xl border-2 border-gray-800 hover:border-primary-500 transition-all duration-300 overflow-hidden hover:shadow-xl"
        >
          <div class="p-8 text-center">
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 mb-5 group-hover:scale-110 transition-transform duration-300">
              <component :is="getSportIcon(sport.name)" class="w-10 h-10 text-white" />
            </div>
            <h3 class="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
              {{ sport.name }}
            </h3>
          </div>
          <div class="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-primary-600/0 group-hover:from-primary-500/5 group-hover:to-primary-600/5 transition-all duration-300"></div>
        </router-link>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue';
import AppLayout from '../components/AppLayout.vue';
import api from '../api/axios';

interface Sport {
  id: number;
  name: string;
}

const sports = ref<Sport[]>([]);
const loading = ref(true);
const error = ref('');
const searchQuery = ref('');

const filteredSports = computed(() => {
  if (!searchQuery.value) return sports.value;
  const query = searchQuery.value.toLowerCase();
  return sports.value.filter(sport =>
    sport.name.toLowerCase().includes(query)
  );
});

const getSportIcon = (sportName: string) => {
  const name = sportName.toLowerCase();

  if (name.includes('football') || name.includes('soccer')) {
    return () => h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z' })
    ]);
  }

  if (name.includes('basketball')) {
    return () => h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { d: 'M17.09 11h4.86a10.041 10.041 0 00-4.95-7.43c.29 2.17.14 4.58 0 7.43zm.82-7.91c2.26 1.66 3.93 4 4.5 6.41h-4.15c-.06-2.02-.14-4.08-.35-6.41zM12 2C7.96 2 4.46 4.23 2.5 7.5h4.09C7.33 4.69 9.5 3.12 12 2.87V2zm.87 0v.13c2.5.25 4.67 1.82 5.41 4.65h4.09C20.54 4.23 17.04 2 13 2zM2 12C2 7.03 5.46 2.97 10 2.17V12H2zm10-10v9.83C16.54 12.97 20 17.03 20 22 20 16.96 16.54 12.9 12 12.17zm0 10v9.83c-2.5-.8-4.5-3.04-5.24-5.83H12zm7.76 5.83c-.74 2.79-2.74 5.03-5.24 5.83V22h-4.5c.74-2.79 2.74-5.03 5.24-5.83h4.5zM2 13h9.5c-.24 2.79-.74 4.96-1.41 6.5H2c0-2.21.86-4.21 2.24-5.83-.97-1.71-1.6-3.58-1.82-5.67h4.15c.21 2.17.41 4.08.43 5.67H2z' })
    ]);
  }

  if (name.includes('tennis')) {
    return () => h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { d: 'M19.52 2.49C17.18.15 12.9.62 9.97 3.55c-1.6 1.6-2.52 3.87-2.54 5.46-.02 1.58.26 3.89-1.35 5.5l-4.24 4.24 1.42 1.42L8.5 15.93c1.61-1.61 3.92-1.33 5.5-1.35 1.59-.02 3.86-.94 5.46-2.54 2.93-2.93 3.4-7.21 1.06-9.55zm-9.2 9.19c-1.53-1.53-1.05-4.61 1.06-6.72s5.18-2.59 6.72-1.06c1.53 1.53 1.05 4.61-1.06 6.72s-5.18 2.59-6.72 1.06z' })
    ]);
  }

  if (name.includes('baseball')) {
    return () => h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM5.61 16.78C4.6 15.45 4 13.8 4 12s.6-3.45 1.61-4.78l1.06 1.06c-.96 1.1-1.53 2.52-1.62 4.06l-1.06.36zm.96-7.59C7.56 7.99 9.07 7.07 11 6.68v1.66c-1.58.35-2.91 1.29-3.82 2.53L5.61 9.81zM11 19.93c-1.93-.39-3.44-1.31-4.39-2.51l1.57-1.06c.91 1.24 2.24 2.18 3.82 2.53v1.04zM12 20c-.69 0-1.35-.1-2-.26v-1.66c.64.16 1.31.26 2 .26s1.36-.1 2-.26v1.66c-.65.16-1.31.26-2 .26zm1-13.32V5.02c1.93.39 3.44 1.31 4.39 2.51l-1.57 1.06c-.91-1.24-2.24-2.18-3.82-2.53zm0 12.64v-1.66c1.58-.35 2.91-1.29 3.82-2.53l1.56 1.06c-.94 1.2-2.45 2.12-4.38 2.51zm5.61-3.54c-.1-1.54-.66-2.96-1.62-4.06l1.06-1.06c1.01 1.33 1.61 2.98 1.61 4.78s-.6 3.45-1.61 4.78l-1.06-1.06c.96-1.1 1.53-2.52 1.62-4.06z' })
    ]);
  }

  if (name.includes('hockey')) {
    return () => h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { d: 'M2 17v3H1v-3c0-2.76 2.24-5 5-5h5v2H6c-1.65 0-3 1.35-3 3zm20-3c0-2.76-2.24-5-5-5h-5v2h5c1.65 0 3 1.35 3 3v3h1v-3zm-8-7h3c.55 0 1 .45 1 1s-.45 1-1 1h-3v2h3c1.65 0 3-1.35 3-3s-1.35-3-3-3h-3v2zm-2 0V5c0-1.65-1.35-3-3-3s-3 1.35-3 3v2h-3c-.55 0-1 .45-1 1s.45 1 1 1h3v2H3c-1.65 0-3-1.35-3-3s1.35-3 3-3h3V5c0-2.76 2.24-5 5-5s5 2.24 5 5v2h3c2.76 0 5 2.24 5 5s-2.24 5-5 5h-3v-2z' })
    ]);
  }

  return () => h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z' })
  ]);
};

const fetchSports = async () => {
  try {
    loading.value = true;
    const response = await api.get('/sports');
    sports.value = response.data;
  } catch (err: any) {
    error.value = err.response?.data?.detail || 'Échec du chargement des sports';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchSports();
});
</script>
