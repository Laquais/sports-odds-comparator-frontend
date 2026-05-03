<template>
  <AppLayout>
    <div>
      <div class="mb-6">
        <button @click="$router.back()" class="text-blue-600 hover:text-blue-700 text-sm">
          &larr; Back to Matches
        </button>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
        <p class="text-red-800">{{ error }}</p>
      </div>

      <div v-else-if="matchOdds">
        <div class="bg-gray-900 rounded-lg shadow p-6 mb-8 border border-gray-700">
          <h1 class="text-3xl font-bold text-white mb-2">
            {{ matchOdds.match.home_team.name }} vs {{ matchOdds.match.away_team.name }}
          </h1>
          <p class="text-gray-400">
            {{ matchOdds.match.league?.name }} - {{ formatDate(matchOdds.match.start_time) }}
          </p>
        </div>

        <div v-if="availableMarkets.length === 0" class="text-center py-12 text-gray-400">
          No odds available for this match
        </div>

        <div v-else>
          <div class="bg-gray-900 rounded-lg shadow border border-gray-700 p-6 mb-6">
            <h2 class="text-lg font-semibold text-white mb-4">Sélectionner un marché</h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <button
                v-for="market in sortedAvailableMarkets"
                :key="market.id"
                @click="selectedMarketId = market.id"
                :class="[
                  'px-4 py-2.5 rounded-lg text-sm font-semibold transition-all',
                  selectedMarketId === market.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                ]"
              >
                {{ market.market.name }}
                <span v-if="market.line" class="text-xs ml-1">({{ market.line }})</span>
              </button>
            </div>
          </div>

          <div v-if="selectedMarket" class="bg-gray-900 rounded-lg shadow border border-gray-700 p-6">
            <h2 class="text-2xl font-bold text-white mb-1">
              {{ selectedMarket.market.name }}
            </h2>
            <p v-if="selectedMarket.market.description" class="text-gray-400 text-sm mb-4">
              {{ selectedMarket.market.description }}
            </p>
            <div v-if="selectedMarket.line" class="text-sm text-gray-400 mb-4">
              Line: {{ selectedMarket.line }}
            </div>

            <div class="space-y-6">
              <div v-for="outcome in sortedOutcomes" :key="outcome.id" class="border-t border-gray-800 pt-4">
                <div class="flex justify-between items-center mb-3">
                  <h3 class="text-lg font-semibold text-white">
                    {{ outcome.label }}
                  </h3>
                  <div v-if="outcome.fair_odds" class="text-sm text-gray-400">
                    Fair Odds: {{ outcome.fair_odds.toFixed(2) }}
                  </div>
                </div>

                <div v-if="outcome.bookmaker_odds.length === 0" class="text-sm text-gray-400">
                  No odds available
                </div>

                <div v-else class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-800">
                    <thead class="bg-gray-800">
                      <tr>
                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">
                          Bookmaker
                        </th>
                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">
                          Odds
                        </th>
                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">
                          Edge
                        </th>
                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">
                          Last Update
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-gray-900 divide-y divide-gray-800">
                      <tr
                        v-for="odd in outcome.bookmaker_odds"
                        :key="odd.bookmaker.id"
                        :class="{
                          'bg-green-900/30': odd.odds === outcome.best_odd
                        }"
                      >
                        <td class="px-4 py-3 text-sm font-medium text-white">
                          {{ odd.bookmaker.name }}
                          <span v-if="odd.odds === outcome.best_odd" class="ml-2 text-green-400 font-bold">
                            BEST
                          </span>
                        </td>
                        <td class="px-4 py-3 text-sm font-semibold text-white">
                          {{ odd.odds.toFixed(2) }}
                        </td>
                        <td class="px-4 py-3 text-sm">
                          <span
                            v-if="odd.edge_odds !== null"
                            :class="{
                              'text-green-400 font-semibold': odd.edge_odds > 0,
                              'text-red-400': odd.edge_odds < 0,
                              'text-gray-400': odd.edge_odds === 0
                            }"
                          >
                            {{ (odd.edge_odds * 100).toFixed(2) }}%
                          </span>
                          <span v-else class="text-gray-400">N/A</span>
                        </td>
                        <td class="px-4 py-3 text-sm text-gray-400">
                          {{ formatDate(odd.last_update) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import AppLayout from '../components/AppLayout.vue';
import api from '../api/axios';

interface Team {
  id: number;
  name: string;
}

interface League {
  id: number;
  name: string;
}

interface Match {
  id: number;
  home_team: Team;
  away_team: Team;
  league: League;
  start_time: string;
}

interface Bookmaker {
  id: number;
  name: string;
}

interface BookmakerOdd {
  bookmaker: Bookmaker;
  odds: number;
  edge_odds: number | null;
  last_update: string;
}

interface Outcome {
  id: number;
  label: string;
  fair_odds: number | null;
  bookmaker_odds: BookmakerOdd[];
  best_odd: number | null;
  best_bookmaker: string | null;
}

interface Market {
  id: number;
  name: string;
  description: string | null;
}

interface MatchMarket {
  id: number;
  market: Market;
  line: number | null;
  period: string | null;
  outcomes: Outcome[];
}

interface MatchOdds {
  match: Match;
  markets: MatchMarket[];
}

const route = useRoute();
const matchId = route.params.matchId;

const matchOdds = ref<MatchOdds | null>(null);
const loading = ref(true);
const error = ref('');
const selectedMarketId = ref<number | null>(null);

const availableMarkets = computed(() => {
  if (!matchOdds.value) return [];
  return matchOdds.value.markets;
});

const sortedAvailableMarkets = computed(() => {
  const markets = [...availableMarkets.value];

  markets.sort((a, b) => {
    if (a.line !== null && b.line !== null) {
      return a.line - b.line;
    }
    return 0;
  });

  return markets;
});

const selectedMarket = computed(() => {
  if (!selectedMarketId.value) return null;
  return availableMarkets.value.find(m => m.id === selectedMarketId.value) || null;
});

const sortedOutcomes = computed(() => {
  if (!selectedMarket.value) return [];

  const outcomes = [...selectedMarket.value.outcomes];

  outcomes.sort((a, b) => {
    const labelA = a.label.toLowerCase();
    const labelB = b.label.toLowerCase();

    if (labelA.includes('home')) return -1;
    if (labelB.includes('home')) return 1;
    if (labelA.includes('draw')) return -1;
    if (labelB.includes('draw')) return 1;
    if (labelA.includes('away')) return -1;
    if (labelB.includes('away')) return 1;

    return 0;
  });

  return outcomes;
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

const fetchMatchOdds = async () => {
  try {
    loading.value = true;
    const response = await api.get(`/matches/${matchId}/odds`);
    matchOdds.value = response.data;

    if (matchOdds.value && matchOdds.value.markets.length > 0) {
      const mlMarket = matchOdds.value.markets.find(m => m.market.name.toLowerCase() === 'ml');
      selectedMarketId.value = mlMarket ? mlMarket.id : matchOdds.value.markets[0].id;
    }
  } catch (err: any) {
    error.value = err.response?.data?.detail || 'Failed to load match odds';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchMatchOdds();
});
</script>
