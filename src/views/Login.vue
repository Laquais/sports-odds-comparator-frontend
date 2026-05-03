<template>
  <div class="min-h-screen flex">
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-900 via-primary-800 to-dark-900 relative overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-20 left-20 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
        <div class="absolute bottom-20 right-20 w-96 h-96 bg-primary-400 rounded-full mix-blend-overlay filter blur-3xl animate-pulse" style="animation-delay: 1s"></div>
      </div>
      <div class="relative z-10 flex flex-col justify-center px-16 text-white">
        <div class="mb-8">
          <div class="flex items-center space-x-3 mb-6">
            <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <svg class="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 9a1 1 0 112 0v4a1 1 0 11-2 0V9zm2-3a1 1 0 100 2 1 1 0 000-2z"/>
              </svg>
            </div>
            <span class="text-2xl font-bold">OddsCompare</span>
          </div>
          <h1 class="text-4xl font-bold mb-4 leading-tight">
            Compare les meilleures cotes<br/>en temps réel
          </h1>
          <p class="text-lg text-primary-100 leading-relaxed">
            Accédez aux cotes de tous les bookmakers et trouvez les meilleures opportunités pour maximiser vos gains.
          </p>
        </div>
        <div class="space-y-4 text-primary-100">
          <div class="flex items-start space-x-3">
            <svg class="w-6 h-6 text-success-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span>Comparaison en temps réel de tous les bookmakers</span>
          </div>
          <div class="flex items-start space-x-3">
            <svg class="w-6 h-6 text-success-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span>Identification des meilleures value bets</span>
          </div>
          <div class="flex items-start space-x-3">
            <svg class="w-6 h-6 text-success-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span>Tous les sports et toutes les ligues</span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-950">
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
          <div class="lg:hidden flex justify-center mb-6">
            <div class="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center">
              <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 9a1 1 0 112 0v4a1 1 0 11-2 0V9zm2-3a1 1 0 100 2 1 1 0 000-2z"/>
              </svg>
            </div>
          </div>
          <h2 class="text-3xl font-bold text-white mb-2">
            Connexion au Comparateur
          </h2>
          <p class="text-gray-400">
            Accédez à votre compte pour comparer les cotes
          </p>
        </div>

        <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
          <div v-if="error" class="rounded-lg bg-red-50 border border-red-200 p-4">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
              </svg>
              <p class="text-sm text-red-800">{{ error }}</p>
            </div>
          </div>

          <div class="space-y-5">
            <div>
              <label for="email" class="block text-sm font-semibold text-gray-300 mb-2">
                Adresse email
              </label>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                class="appearance-none block w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                placeholder="votre@email.com"
              />
            </div>
            <div>
              <div class="flex justify-between items-center mb-2">
                <label for="password" class="block text-sm font-semibold text-gray-300">
                  Mot de passe
                </label>
                <a href="#" class="text-xs font-medium text-primary-400 hover:text-primary-300 transition">
                  Mot de passe oublié ?
                </a>
              </div>
              <input
                id="password"
                v-model="password"
                type="password"
                required
                class="appearance-none block w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading"
              class="group relative w-full flex justify-center items-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-700 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <span v-if="!loading">Se connecter</span>
              <span v-else class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connexion en cours...
              </span>
            </button>
          </div>

          <div class="text-center">
            <p class="text-sm text-gray-400">
              Pas encore de compte ?
              <router-link to="/register" class="font-semibold text-primary-400 hover:text-primary-300 transition">
                Créer un compte
              </router-link>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  loading.value = true;
  error.value = '';

  try {
    await authStore.login(email.value, password.value);
    router.push('/');
  } catch (err: any) {
    error.value = err.response?.data?.detail || 'Login failed. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>
