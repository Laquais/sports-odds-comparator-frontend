<template>
  <AppLayout>
    <div>
      <div class="mb-6">
        <router-link to="/sports" class="text-blue-600 hover:text-blue-700 text-sm">
          &larr; Back to Sports
        </router-link>
      </div>

      <h2 class="text-3xl font-bold text-gray-900 mb-6">Leagues</h2>

      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
        <p class="text-red-800">{{ error }}</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <router-link
          v-for="league in leagues"
          :key="league.id"
          :to="`/leagues/${league.id}/matches`"
          class="bg-gray-900 rounded-lg shadow hover:shadow-md transition p-6 border border-gray-200"
        >
          <h3 class="text-xl font-semibold text-gray-900">{{ league.name }}</h3>
        </router-link>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import AppLayout from '../components/AppLayout.vue';
import api from '../api/axios';

interface League {
  id: number;
  name: string;
  sport_id: number;
}

const route = useRoute();
const sportId = route.params.sportId;

const leagues = ref<League[]>([]);
const loading = ref(true);
const error = ref('');

const fetchLeagues = async () => {
  try {
    loading.value = true;
    const response = await api.get(`/sports/${sportId}/leagues`);
    leagues.value = response.data;
  } catch (err: any) {
    error.value = err.response?.data?.detail || 'Failed to load leagues';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchLeagues();
});
</script>
