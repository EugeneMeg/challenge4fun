import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/views/HomeView.vue'),
        },
        {
            path: '/death_match',
            name: 'death_match',
            component: () => import('@/views/DeathMatch.vue'),
        },
    ],
})

export default router
