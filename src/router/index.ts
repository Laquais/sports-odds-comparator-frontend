import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/Register.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/Home.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/sports',
      name: 'Sports',
      component: () => import('../views/Sports.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/sports/:sportId/matches',
      name: 'Matches',
      component: () => import('../views/Matches.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/matches/:matchId/odds',
      name: 'MatchOdds',
      component: () => import('../views/MatchOdds.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/explorer',
      name: 'Explorer',
      component: () => import('../views/Explorer.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/freebets',
      name: 'Freebets',
      component: () => import('../views/Freebets.vue'),
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if ((to.name === 'Login' || to.name === 'Register') && authStore.isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;
