<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">
          Opportunités Freebets
        </h1>
        <p class="text-gray-400">
          Maximisez vos gains en convertissant vos freebets sur les meilleures opportunités
        </p>
      </div>

      <div class="bg-gray-900 rounded-2xl border border-gray-800 shadow-sm mb-6">
        <div class="p-6 border-b border-gray-800">
          <h2 class="text-lg font-semibold text-white mb-4">Sélectionner un bookmaker</h2>

          <div v-if="loadingBookmakers" class="text-center py-12">
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 mb-3">
              <svg class="animate-spin h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p class="text-gray-400 text-sm">Chargement des bookmakers...</p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              v-for="bookmaker in bookmakers"
              :key="bookmaker.id"
              @click="selectBookmaker(bookmaker.id)"
              :class="[
                'p-4 rounded-xl border-2 transition-all duration-200 text-left',
                selectedBookmaker === bookmaker.id
                  ? 'border-primary-500 bg-primary-50 shadow-md'
                  : 'border-gray-700 hover:border-primary-500 hover:bg-gray-800'
              ]"
            >
              <div class="flex items-center justify-between">
                <span class="text-base font-semibold text-white">{{ bookmaker.name }}</span>
                <div v-if="selectedBookmaker === bookmaker.id" class="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div v-if="!selectedBookmaker && !loadingBookmakers" class="text-center py-20">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
            <svg class="h-8 w-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-300 mb-2">Sélectionnez un bookmaker</h3>
          <p class="text-gray-400">Choisissez un bookmaker pour voir les opportunités de freebets</p>
        </div>

        <div v-else-if="loadingOpportunities" class="text-center py-20">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
            <svg class="animate-spin h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p class="text-gray-400">Chargement des opportunités...</p>
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

        <div v-else-if="selectedBookmaker && opportunities.length === 0" class="text-center py-20">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
            <svg class="h-8 w-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-300 mb-2">Aucune opportunité trouvée</h3>
          <p class="text-gray-400">Aucune opportunité de freebet disponible pour ce bookmaker</p>
        </div>

        <div v-else-if="opportunities.length > 0">
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-800 border-b border-gray-700">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Edge Freebet
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Cote
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Match
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Marché
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Issue
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Horaire
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Mise (Freebet)
                  </th>
                </tr>
              </thead>
              <tbody class="bg-gray-900 divide-y divide-gray-800">
                <tr
                  v-for="(opp, index) in opportunities"
                  :key="index"
                  class="hover:bg-gray-800 cursor-pointer transition"
                  @click="goToMatch(opp.match_id)"
                >
                  <td class="px-6 py-4">
                    <div class="inline-flex items-center px-3 py-1.5 rounded-lg"
                         :class="getEdgeClass(opp.edge_freebet)">
                      <span class="text-sm font-bold">{{ (opp.edge_freebet * 100).toFixed(2) }}%</span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span class="text-base font-bold text-white">{{ opp.odds.toFixed(2) }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="font-semibold text-white">{{ opp.home_team_name }} - {{ opp.away_team_name }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-800 text-gray-300">
                      {{ opp.market_name }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center">
                      <span class="text-sm font-medium text-gray-300 mr-2">{{ opp.outcome_label }}</span>
                      <div v-if="opp.existing_bets.length > 0" class="relative group">
                        <!-- Icône Warning -->
                        <svg class="w-5 h-5 text-orange-500 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                        </svg>
                        <!-- Tooltip (Toolbox) -->
                        <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 hidden group-hover:block z-50">
                          <div class="bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-3 text-xs text-white">
                            <div class="font-bold text-orange-400 mb-2 border-b border-gray-600 pb-1">
                              Déjà parié sur cette issue :
                            </div>
                            <ul class="space-y-1">
                              <li v-for="(bet, bIndex) in opp.existing_bets" :key="bIndex" class="flex justify-between items-center">
                                <span class="text-gray-300">{{ bet.bookmaker_name }}</span>
                                <span class="font-mono font-semibold">{{ bet.stake }}€ ({{ bet.bet_type }})</span>
                              </li>
                            </ul>
                          </div>
                          <!-- Petite flèche du tooltip -->
                          <div class="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800"></div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-gray-400 text-sm">
                    {{ formatDateTime(opp.start_time) }}
                  </td>
                  <td class="px-6 py-4" @click.stop>
                    <div class="flex items-center space-x-2">
                      <div class="relative w-24">
                        <input
                          type="number"
                          min="1"
                          step="1"
                          placeholder="€"
                          v-model.number="stakes[getOpportunityKey(opp)]"
                          class="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-primary-500"
                        />
                      </div>
                      <button
                        @click="saveBet(opp)"
                        :disabled="!stakes[getOpportunityKey(opp)] || takingBet === getOpportunityKey(opp)"
                        class="p-1.5 rounded bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                        title="Enregistrer ce pari"
                      >
                        <svg v-if="takingBet === getOpportunityKey(opp)" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="p-6 border-t border-gray-800 flex items-center justify-between">
            <div class="text-sm text-gray-400">
              Page {{ currentPage }} sur {{ totalPages }} ({{ total }} opportunités)
            </div>

            <div class="flex items-center space-x-2">
              <button
                @click="previousPage"
                :disabled="currentPage === 1"
                class="px-4 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Précédent
              </button>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import AppLayout from '../components/AppLayout.vue';
import api from '../api/axios';

interface Bookmaker {
  id: number;
  name: string;
}

interface ExistingBet {
  bookmaker_name: string;
  stake: number;
  bet_type: string;
}

interface FreebetOpportunity {
  edge_freebet: number;
  odds: number;
  start_time: string;
  home_team_name: string;
  away_team_name: string;
  market_name: string;
  outcome_label: string;
  match_id: number;
  bookmaker_name: string;
  existing_bets: ExistingBet[];
}

interface UserBetCreate {
  match_id: number;
  bookmaker_name: string;
  home_team: string;
  away_team: string;
  market_name: string;
  outcome_label: string;
  odds: number;
  stake: number;
  bet_type: string;
}

const router = useRouter();

const bookmakers = ref<Bookmaker[]>([]);
const opportunities = ref<FreebetOpportunity[]>([]);
const selectedBookmaker = ref<number | null>(null);
const loadingBookmakers = ref(true);
const loadingOpportunities = ref(false);
const error = ref('');

const currentPage = ref(1);
const totalPages = ref(1);
const total = ref(0);
const pageSize = 20;

const stakes = ref<Record<string, number>>({});
const takingBet = ref<string | null>(null);

const getEdgeClass = (edge: number) => {
  if (edge > 0.1) return 'bg-success-100 text-success-800 border border-success-300';
  if (edge > 0.05) return 'bg-success-50 text-success-700 border border-success-200';
  return 'bg-primary-50 text-primary-700 border border-primary-200';
};

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

const selectBookmaker = async (bookmakerId: number) => {
  selectedBookmaker.value = bookmakerId;
  currentPage.value = 1;
  await fetchOpportunities();
};

const goToMatch = (matchId: number) => {
  router.push(`/matches/${matchId}/odds`);
};

const nextPage = async () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    await fetchOpportunities();
  }
};

const previousPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    await fetchOpportunities();
  }
};

const fetchBookmakers = async () => {
  try {
    loadingBookmakers.value = true;
    const response = await api.get('/freebets/bookmakers');
    bookmakers.value = response.data;
  } catch (err: any) {
    error.value = err.response?.data?.detail || 'Échec du chargement des bookmakers';
  } finally {
    loadingBookmakers.value = false;
  }
};

const fetchOpportunities = async () => {
  if (!selectedBookmaker.value) return;

  try {
    loadingOpportunities.value = true;
    error.value = '';

    const response = await api.get('/freebets/opportunities', {
      params: {
        bookmaker_id: selectedBookmaker.value,
        page: currentPage.value,
        page_size: pageSize
      }
    });

    opportunities.value = response.data.items;
    total.value = response.data.total;
    totalPages.value = response.data.total_pages;
  } catch (err: any) {
    error.value = err.response?.data?.detail || 'Échec du chargement des opportunités';
  } finally {
    loadingOpportunities.value = false;
  }
};

const getOpportunityKey = (opp: FreebetOpportunity) => {
  return `${opp.match_id}-${opp.market_name}-${opp.outcome_label}`;
};

const saveBet = async (opp: FreebetOpportunity) => {
  const key = getOpportunityKey(opp);
  const stakeAmount = stakes.value[key];

  if (!stakeAmount || stakeAmount <= 0) return;

  try {
    takingBet.value = key;

    const payload: UserBetCreate = {
      match_id: opp.match_id,
      bookmaker_name: opp.bookmaker_name,
      home_team: opp.home_team_name,
      away_team: opp.away_team_name,
      market_name: opp.market_name,
      outcome_label: opp.outcome_label,
      odds: opp.odds,
      stake: stakeAmount,
      bet_type: 'freebet'
    };

    await api.post('/bets/', payload);
    
    // Feedback visuel simple (tu pourrais utiliser un système de Toast/Notification plus global)
    alert(`Pari enregistré ! Gain potentiel en cash : ${(stakeAmount * (opp.odds - 1)).toFixed(2)}€`);
    
    // Reset input
    delete stakes.value[key];

  } catch (err: any) {
    console.error(err);
    alert("Erreur lors de l'enregistrement du pari.");
  } finally {
    takingBet.value = null;
  }
};

onMounted(() => {
  fetchBookmakers();
});
</script>
