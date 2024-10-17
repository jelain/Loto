// frontend/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import CreateUser from '../views/CreateUser.vue';
import PlayersList from '../views/PlayersList.vue';
import TirageLoterie from '../views/TirageLoto.vue';
import NotFoundPage from '../views/NotFoundPage.vue';
import TirageClassementBot from "../views/TirageClassementBot.vue";
import TirageClassementPlayer from "../views/TirageClassementPlayer.vue";
import TirageClassementPlayerBot from "../views/TirageClassementPlayerBot.vue";

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
        path: '/tirage/bot',
        name: 'TirageClassementBot',
        component: TirageClassementBot
    },
    {
        path: '/tirage/player',
        name: 'TirageClassementPlayer',
        component: TirageClassementPlayer
    },
    {
        path: '/tirage/playerbot',
        name: 'TirageClassementPlayerBot',
        component: TirageClassementPlayerBot
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
