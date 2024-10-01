// frontend/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import CreateUser from '../views/CreateUser.vue';
import PlayersList from '../views/PlayersList.vue';
import NotFoundPage from '../views/NotFoundPage.vue';

const routes = [
    {
        path: '/create-user',
        name: 'CreateUser',
        component: CreateUser
    },
    {
        path: '/',
        name: 'PlayersList',
        component: PlayersList
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFoundPage
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
