// frontend/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import CreateUser from '../views/CreateUser.vue';
import PlayersList from '../views/PlayersList.vue';
import TirageLoterie from '../views/TirageLoterie.vue';
import NotFoundPage from '../views/NotFoundPage.vue';

const routes = [
    {
        path: '/players',
        component: PlayersList,
    },
    {
        path: '/players/create',
        component: CreateUser
    },
    {
        path: '/tirage',
        name: 'TirageLoterie',
        component: TirageLoterie
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
