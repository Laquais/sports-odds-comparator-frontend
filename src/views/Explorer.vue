<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">
          Explorateur d'opportunités EV
        </h1>
        <p class="text-gray-400">
          Découvrez les meilleures opportunités avec l'edge le plus élevé
        </p>
      </div>

      <div class="bg-gray-900 rounded-2xl border border-gray-700 shadow-sm mb-6">
        <div class="p-6 border-b border-gray-800">
          <h2 class="text-lg font-semibold text-white mb-4">Filtres</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-300 mb-2">
                Bookmaker
              </label>
              <select
                v-model.number="filters.bookmaker_id"
                class="w-full px-4 py-2.5 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition appearance-none bg-gray-900"
                @change="fetchOpportunities"
              >
                <option :value="null">Tous les bookmakers</option>
                <option
                  v-for="bookmaker in bookmakers"
                  :key="bookmaker.id"
                  :value="bookmaker.id"
                >
                  {{ bookmaker.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-300 mb-2">
                Côte min
              </label>
              <input
                v-model.number="filters.min_odds"
                type="number"
                step="0.1"
                min="1"
                placeholder="ex: 1.5"
                class="w-full px-4 py-2.5 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition bg-gray-900"
                @change="fetchOpportunities"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-300 mb-2">
                Côte max
              </label>
              <input
                v-model.number="filters.max_odds"
                type="number"
                step="0.1"
                min="1"
                placeholder="ex: 5.0"
                class="w-full px-4 py-2.5 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition bg-gray-900"
                @change="fetchOpportunities"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-300 mb-2">
                EV min (%)
              </label>
              <input
                v-model.number="filters.min_ev"
                type="number"
                step="0.01"
                placeholder="ex: 0.05 (5%)"
                class="w-full px-4 py-2.5 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition bg-gray-900"
                @change="fetchOpportunities"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-300 mb-2">
                Date de début
              </label>
              <input
                v-model="filters.start_date"
                type="date"
                class="w-full px-4 py-2.5 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition bg-gray-900"
                @change="fetchOpportunities"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-300 mb-2">
                Date de fin
              </label>
              <input
                v-model="filters.end_date"
                type="date"
                class="w-full px-4 py-2.5 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition bg-gray-900"
                @change="fetchOpportunities"
              />
            </div>
          </div>

          <div class="mt-4 flex justify-end">
            <button
              @click="resetFilters"
              class="px-4 py-2.5 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 font-medium transition"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>

      <div v-else-if="error" class="bg-red-900/20 border border-red-700 rounded-lg p-4">
        <p class="text-red-400">{{ error }}</p>
      </div>

      <div v-else>
        <div class="bg-gray-900 rounded-2xl border border-gray-700 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-800">
              <thead class="bg-gray-800">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    EV
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Côte
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Sport
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Match
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Marché
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Issue
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Bookmaker
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Horaire
                  </th>
                </tr>
              </thead>
              <tbody class="bg-gray-900 divide-y divide-gray-800">
                <tr
                  v-for="opportunity in opportunities"
                  :key="`${opportunity.match_id}-${opportunity.bookmaker_name}-${opportunity.outcome_label}`"
                  class="hover:bg-gray-800/50 transition cursor-pointer"
                  @click="goToMatch(opportunity.match_id)"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="text-sm font-bold"
                      :class="{
                        'text-green-400': opportunity.edge_odds > 0.05,
                        'text-yellow-400': opportunity.edge_odds > 0 && opportunity.edge_odds <= 0.05,
                        'text-gray-400': opportunity.edge_odds <= 0
                      }"
                    >
                      {{ (opportunity.edge_odds * 100).toFixed(2) }}%
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">
                    {{ opportunity.odds.toFixed(2) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {{ opportunity.sport_name }}
                  </td>
                  <td class="px-6 py-4 text-sm text-white">
                    {{ opportunity.home_team_name }} vs {{ opportunity.away_team_name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {{ opportunity.market_name }}
                    <span v-if="opportunity.market_line" class="text-xs text-gray-500">
                      ({{ opportunity.market_line }})
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {{ opportunity.outcome_label }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-400">
                    {{ opportunity.bookmaker_name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {{ formatDateTime(opportunity.start_time) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="opportunities.length === 0" class="text-center py-12 text-gray-400">
            Aucune opportunité trouvée avec ces filtres
          </div>
        </div>

        <div v-if="totalPages > 1" class="mt-6 flex justify-center items-center space-x-4">
          <button
            @click="previousPage"
            :disabled="currentPage === 1"
            class="px-4 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Précédent
          </button>
          <span class="text-gray-400">
            Page {{ currentPage }} sur {{ totalPages }}
          </span>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AppLayout from '../components/AppLayout.vue';
import api from '../api/axios';

interface Bookmaker {
  id: number;
  name: string;
}

interface EVOpportunity {
  edge_odds: number;
  odds: number;
  sport_name: string;
  home_team_name: string;
  away_team_name: string;
  market_name: string;
  market_line: number | null;
  outcome_label: string;
  start_time: string;
  match_id: number;
  bookmaker_name: string;
}

const router = useRouter();

const opportunities = ref<EVOpportunity[]>([]);
const bookmakers = ref<Bookmaker[]>([]);
const loading = ref(false);
const error = ref('');

const filters = ref({
  bookmaker_id: null as number | null,
  min_odds: null as number | null,
  max_odds: null as number | null,
  min_ev: null as number | null,
  start_date: '',
  end_date: ''
});

const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = 20;

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dateStr = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  const timeStr = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  if (date.toDateString() === today.toDateString()) {
    return `Aujourd'hui ${timeStr}`;
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return `Demain ${timeStr}`;
  }
  return `${dateStr} ${timeStr}`;
};

const fetchBookmakers = async () => {
  try {
    const response = await api.get('/bookmakers');
    bookmakers.value = response.data;
  } catch (err) {
    console.error('Failed to fetch bookmakers:', err);
  }
};

const fetchOpportunities = async () => {
  try {
    loading.value = true;
    error.value = '';

    const params = new URLSearchParams();
    params.append('page', String(currentPage.value));
    params.append('page_size', String(pageSize));

    if (filters.value.bookmaker_id) {
      params.append('bookmaker_id', String(filters.value.bookmaker_id));
    }

    if (filters.value.min_odds !== null) {
      params.append('min_odds', String(filters.value.min_odds));
    }

    if (filters.value.max_odds !== null) {
      params.append('max_odds', String(filters.value.max_odds));
    }

    if (filters.value.min_ev !== null) {
      params.append('min_ev', String(filters.value.min_ev));
    }

    if (filters.value.start_date) {
      params.append('start_date', new Date(filters.value.start_date).toISOString());
    }

    if (filters.value.end_date) {
      params.append('end_date', new Date(filters.value.end_date).toISOString());
    }

    const url = `/best-ev?${params.toString()}`;
    const response = await api.get(url);

    opportunities.value = response.data.items;
    totalPages.value = response.data.total_pages;
  } catch (err: any) {
    error.value = err.response?.data?.detail || 'Échec du chargement des opportunités';
  } finally {
    loading.value = false;
  }
};

const resetFilters = () => {
  filters.value = {
    bookmaker_id: null,
    min_odds: null,
    max_odds: null,
    min_ev: null,
    start_date: '',
    end_date: ''
  };
  currentPage.value = 1;
  fetchOpportunities();
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchOpportunities();
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchOpportunities();
  }
};

const goToMatch = (matchId: number) => {
  router.push(`/matches/${matchId}/odds`);
};

onMounted(() => {
  fetchBookmakers();
  fetchOpportunities();
});
</script>
