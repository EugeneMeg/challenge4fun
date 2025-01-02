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
            path: '/death_match_squat',
            name: 'death_match_squat',
            component: () => import('@/views/DeathMatchSquat.vue'),
        },
    ],
})

export default router
