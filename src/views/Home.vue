<template>
  <AppLayout>
    <div class="text-center py-12">
      <h1 class="text-4xl font-bold text-white mb-4">
        Welcome to Odds Comparator
      </h1>
      <p class="text-xl text-gray-400 mb-8">
        Compare sports betting odds across multiple bookmakers
      </p>
      <router-link
        to="/sports"
        class="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
      >
        Browse Sports
      </router-link>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '../components/AppLayout.vue';
</script>
