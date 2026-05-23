<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <router-link to="/sports" class="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm transition">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Retour aux sports
        </router-link>
      </div>

      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">
          {{ sportName || 'Matchs' }}
        </h1>
        <p class="text-gray-400">
          Comparez les cotes des différents bookmakers
        </p>
      </div>

      <div class="bg-gray-900 rounded-2xl border border-gray-700 shadow-sm mb-6">
        <div class="p-6 border-b border-gray-800">
          <h2 class="text-lg font-semibold text-white mb-4">Filtres</h2>

          <!-- Sélection marché / période / ligne -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label class="block text-sm font-semibold text-gray-300 mb-2">Marché</label>
              <select
                v-model.number="filters.marketId"
                class="w-full px-4 py-2.5 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition appearance-none bg-gray-900"
                @change="handleMarketChange"
              >
                <option v-for="market in markets" :key="market.id" :value="market.id">
                  {{ market.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-300 mb-2">Période</label>
              <select
                v-model="filters.period"
                class="w-full px-4 py-2.5 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition appearance-none bg-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
                :disabled="availablePeriods.length === 0"
                @change="fetchMatches"
              >
                <option value="">Toutes les périodes</option>
                <option v-for="period in availablePeriods" :key="period" :value="period">
                  {{ periodLabels[period] || period }}
                </option>
              </select>
            </div>

            <div v-if="availableLines.length > 0">
              <label class="block text-sm font-semibold text-gray-300 mb-2">Ligne</label>
              <select
                :value="filters.line === null ? '' : String(filters.line)"
                class="w-full px-4 py-2.5 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition appearance-none bg-gray-900"
                @change="(e) => { filters.line = (e.target as HTMLSelectElement).value === '' ? null : Number((e.target as HTMLSelectElement).value); fetchMatches(); }"
              >
                <option value="">Toutes les lignes</option>
                <option v-for="line in availableLines" :key="line" :value="String(line)">
                  {{ line > 0 ? '+' + line : line }}
                </option>
              </select>
            </div>
          </div>

          <!-- Recherche et dates -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-300 mb-2">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                Recherche d'équipe
              </label>
              <input
                v-model="filters.search"
                type="text"
                placeholder="Nom d'équipe..."
                class="w-full px-4 py-2.5 border border-gray-700 rounded-lg text-black placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                @input="debouncedFetch"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-300 mb-2">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                Date de début
              </label>
              <input
                v-model="filters.startDate"
                type="date"
                class="w-full px-4 py-2.5 border border-gray-700 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                @change="fetchMatches"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-300 mb-2">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                Date de fin
              </label>
              <input
                v-model="filters.endDate"
                type="date"
                class="w-full px-4 py-2.5 border border-gray-700 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                @change="fetchMatches"
              />
            </div>
          </div>

          <div class="mt-4">
            <button
              @click="openLeagueSelector"
              class="inline-flex items-center px-4 py-2.5 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 font-medium transition"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
              </svg>
              Ligues sélectionnées ({{ selectedLeagues.length }})
            </button>

            <button
              v-if="hasActiveFilters"
              @click="resetFilters"
              class="ml-3 inline-flex items-center px-4 py-2.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 font-medium transition"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              Réinitialiser
            </button>
          </div>
        </div>

        <div v-if="loading" class="text-center py-20">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
            <svg class="animate-spin h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p class="text-gray-400">Chargement des matchs...</p>
        </div>

        <div v-else-if="error" class="p-6">
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

        <div v-else-if="matches.length === 0" class="text-center py-20">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
            <svg class="h-8 w-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-300 mb-2">Aucun match trouvé</h3>
          <p class="text-gray-400">Essayez de modifier vos filtres</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gray-800 border-b border-gray-700">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Match
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Ligue
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition"
                    @click="toggleSort">
                  <div class="flex items-center">
                    Horaire
                    <svg class="w-4 h-4 ml-1" :class="{ 'rotate-180': sortOrder === 'asc' }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </div>
                </th>
                <th class="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Home
                </th>
                <th class="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Draw
                </th>
                <th class="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Away
                </th>
              </tr>
            </thead>
            <tbody class="bg-gray-900 divide-y divide-gray-800">
              <tr
                v-for="match in sortedMatches"
                :key="match.id"
                class="hover:bg-primary-50/30 cursor-pointer transition"
                @click="goToMatchOdds(match.id)"
              >
                <td class="px-6 py-4">
                  <div class="font-semibold text-white">
                    {{ match.home_team && match.away_team
                      ? `${match.home_team.name} - ${match.away_team.name}`
                      : match.name }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-800 text-gray-300">
                    {{ match.league?.name || 'N/A' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-gray-400 text-sm">
                  {{ formatDateTime(match.start_time) }}
                </td>
                <td class="px-6 py-4 text-center">
                  <div v-if="getBestOutcomeOdds(match, 'home')" class="text-sm">
                    <div class="font-bold text-white">
                      {{ getBestOutcomeOdds(match, 'home')!.value.toFixed(2) }}
                    </div>
                    <div class="text-xs text-gray-400">
                      ({{ getBestOutcomeOdds(match, 'home')!.bookmakers.join(', ') }})
                    </div>
                  </div>
                  <div v-else class="text-xs text-gray-500">-</div>
                </td>

                <td class="px-6 py-4 text-center">
                  <div v-if="getBestOutcomeOdds(match, 'draw')" class="text-sm">
                    <div class="font-bold text-white">
                      {{ getBestOutcomeOdds(match, 'draw')!.value.toFixed(2) }}
                    </div>
                    <div class="text-xs text-gray-400">
                      ({{ getBestOutcomeOdds(match, 'draw')!.bookmakers.join(', ') }})
                    </div>
                  </div>
                  <div v-else class="text-xs text-gray-500">-</div>
                </td>

                <td class="px-6 py-4 text-center">
                  <div v-if="getBestOutcomeOdds(match, 'away')" class="text-sm">
                    <div class="font-bold text-white">
                      {{ getBestOutcomeOdds(match, 'away')!.value.toFixed(2) }}
                    </div>
                    <div class="text-xs text-gray-400">
                      ({{ getBestOutcomeOdds(match, 'away')!.bookmakers.join(', ') }})
                    </div>
                  </div>
                  <div v-else class="text-xs text-gray-500">-</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="showLeagueSelector" class="fixed inset-0 bg-dark-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="closeLeagueSelector">
      <div class="bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div class="p-6 border-b border-gray-700 flex justify-between items-center">
          <h3 class="text-xl font-bold text-white">Sélectionner les ligues</h3>
          <button @click="closeLeagueSelector" class="text-gray-500 hover:text-gray-400 transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="p-6 overflow-y-auto max-h-96">
          <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <input
              v-model="leagueSearch"
              type="text"
              placeholder="Rechercher une ligue..."
              class="w-full md:max-w-xs px-3 py-2 border border-gray-700 rounded-lg text-sm text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            />
            <button
              @click="toggleAllLeagues"
              class="text-sm font-semibold text-primary-600 hover:text-primary-700 transition"
            >
              {{ allLeaguesSelected ? 'Tout désélectionner' : 'Tout sélectionner' }}
            </button>
          </div>

          <div v-if="loadingLeagues" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>

          <div v-else class="space-y-2">
            <label
              v-for="league in filteredLeagues"
              :key="league.id"
              class="flex items-center p-3 rounded-lg hover:bg-gray-800 cursor-pointer transition"
            >
              <input
                type="checkbox"
                :value="league.id"
                v-model="selectedLeagues"
                class="w-5 h-5 text-primary-600 border-gray-700 rounded focus:ring-primary-500 focus:ring-2"
                @change="fetchMatches"
              />
              <span class="ml-3 text-gray-300 font-medium">{{ league.name }}</span>
            </label>
          </div>
        </div>

        <div class="p-6 border-t border-gray-700 flex justify-end">
          <button
            @click="closeLeagueSelector"
            class="px-6 py-2.5 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition"
          >
            Appliquer
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppLayout from '../components/AppLayout.vue';
import api from '../api/axios';

interface Team {
  id: number;
  name: string;
}

interface League {
  id: number;
  name: string;
  sport_id: number;
}

interface Match {
  id: number;
  sport_id: number;
  league_id: number;
  event_type: 'MATCH' | 'OUTRIGHT';
  name: string | null;
  home_team_id: number | null;
  away_team_id: number | null;
  start_time: string;
  home_team: Team | null;
  away_team: Team | null;
  league: League;
  best_odds?: Partial<Record<OutcomeKey, BestOutcomeOdds | null>>;
}

interface MarketOdd {
  bookmaker: string;   // "Betclic"
  value: number;       // 2.35
}

interface MarketOutcome {
  key: string;         // 'home' | 'draw' | 'away' (ou autre selon ton backend)
  label: string;       // "Home", "Draw", "Away"
  odds: MarketOdd[];
}

interface Market {
  id: number;
  name: string;
  description?: string | null;
  market_type?: string;
}

interface BestOutcomeOdds {
  value: number;
  bookmakers: string[];
}

type OutcomeKey = 'home' | 'draw' | 'away';

const route = useRoute();
const router = useRouter();
const sportId = route.params.sportId;

const matches = ref<Match[]>([]);
const availableLeagues = ref<League[]>([]);
const selectedLeagues = ref<number[]>([]);
const markets = ref<Market[]>([]);         
const loading = ref(true);
const loadingLeagues = ref(false);
const error = ref('');
const sportName = ref('');
const showLeagueSelector = ref(false);
const sortOrder = ref<'asc' | 'desc'>('asc');

const filters = ref<{
  search: string;
  marketId: number | null;
  period: string;
  line: number | null;
  startDate: string;
  endDate: string;
}>({
  search: '',
  marketId: null,
  period: '',
  line: null,
  startDate: '',
  endDate: ''
});
const leagueSearch = ref('');

const availableLines = ref<number[]>([]);
const availablePeriods = ref<string[]>([]);
const loadingMarketOptions = ref(false);

const periodLabels: Record<string, string> = {
  'FT': 'Temps plein',
  'RT': 'Temps réglementaire',
  '1H': '1ère mi-temps',
  '2H': '2ème mi-temps',
};

let debounceTimeout: number | null = null;

const hasActiveFilters = computed(() => {
  return filters.value.search !== '' ||
         filters.value.startDate !== '' ||
         filters.value.endDate !== '' ||
         selectedLeagues.value.length > 0;
});

const allLeaguesSelected = computed(() => {
  return selectedLeagues.value.length === availableLeagues.value.length && availableLeagues.value.length > 0;
});

const filteredLeagues = computed(() => {
  const q = leagueSearch.value.trim().toLowerCase();
  if (!q) return availableLeagues.value;
  return availableLeagues.value.filter(l =>
    l.name.toLowerCase().includes(q)
  );
});

const sortedMatches = computed(() => {
  const sorted = [...matches.value];
  sorted.sort((a, b) => {
    const dateA = new Date(a.start_time).getTime();
    const dateB = new Date(b.start_time).getTime();
    return sortOrder.value === 'asc' ? dateA - dateB : dateB - dateA;
  });
  return sorted;
});

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

const toggleSort = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
};

const openLeagueSelector = () => {
  showLeagueSelector.value = true;
  if (availableLeagues.value.length === 0) {
    fetchLeagues();
  }
};

const closeLeagueSelector = () => {
  showLeagueSelector.value = false;
};

const toggleAllLeagues = () => {
  if (allLeaguesSelected.value) {
    selectedLeagues.value = [];
  } else {
    selectedLeagues.value = availableLeagues.value.map(l => l.id);
  }
  fetchMatches();
};

const debouncedFetch = () => {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }
  debounceTimeout = window.setTimeout(() => {
    fetchMatches();
  }, 500);
};

const resetFilters = () => {
  filters.value.search = '';
  filters.value.period = '';
  filters.value.line = null;
  filters.value.startDate = '';
  filters.value.endDate = '';
  selectedLeagues.value = [];
  fetchMatches();
};

const goToMatchOdds = (matchId: number) => {
  router.push(`/matches/${matchId}/odds`);
};

const fetchMarketOptions = async (marketId: number) => {
  try {
    loadingMarketOptions.value = true;
    const response = await api.get(`/sports/${sportId}/markets/${marketId}/options`);
    availablePeriods.value = response.data.periods || [];
    availableLines.value = response.data.lines || [];
    filters.value.period = '';
    filters.value.line = null;
  } catch {
    availablePeriods.value = [];
    availableLines.value = [];
  } finally {
    loadingMarketOptions.value = false;
  }
};

const handleMarketChange = async () => {
  if (filters.value.marketId) {
    await fetchMarketOptions(filters.value.marketId);
  } else {
    availablePeriods.value = [];
    availableLines.value = [];
    filters.value.period = '';
    filters.value.line = null;
  }
  fetchMatches();
};

const fetchMarkets = async () => {
  const response = await api.get(`/sports/${sportId}/markets`);
  markets.value = response.data;

  if (!filters.value.marketId && markets.value.length > 0) {
    const mlMarket = markets.value.find(m => m.name.toLowerCase() === 'ml');
    filters.value.marketId = mlMarket ? mlMarket.id : markets.value[0].id;
  }
};

const fetchLeagues = async () => {
  try {
    loadingLeagues.value = true;
    const response = await api.get(`/sports/${sportId}/leagues`);
    availableLeagues.value = response.data;
  } catch (err: any) {
    console.error('Failed to load leagues:', err);
  } finally {
    loadingLeagues.value = false;
  }
};

const fetchMatches = async () => {
  try {
    loading.value = true;
    error.value = '';

    const params = new URLSearchParams();

    if (selectedLeagues.value.length > 0) {
      params.append('league_ids', selectedLeagues.value.join(','));
    }

    if (filters.value.startDate) {
      params.append('start_date', new Date(filters.value.startDate).toISOString());
    }

    if (filters.value.endDate) {
      params.append('end_date', new Date(filters.value.endDate).toISOString());
    }

    if (filters.value.search) {
      params.append('search', filters.value.search);
    }

    if (filters.value.marketId) {
      params.append('market_id', String(filters.value.marketId));
    }

    if (filters.value.period) {
      params.append('period', filters.value.period);
    }

    if (filters.value.line !== null) {
      params.append('line', String(filters.value.line));
    }

    const url = `/sports/${sportId}/matches-with-odds${params.toString() ? '?' + params.toString() : ''}`;
    const response = await api.get(url);
    matches.value = response.data;

  } catch (err: any) {
    error.value = err.response?.data?.detail || 'Échec du chargement des matchs';
  } finally {
    loading.value = false;
  }
};

const getBestOutcomeOdds = (match: Match, outcomeKey: 'home' | 'draw' | 'away') => {
  if (!match.best_odds) return null;
  return match.best_odds[outcomeKey] ?? null;
};

onMounted(async () => {
  await fetchMarkets();
  if (filters.value.marketId) {
    await fetchMarketOptions(filters.value.marketId);
  }
  fetchMatches();
});
</script>
