// frontend/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import CreateUser from '../views/CreateUser.vue';
import PlayersList from '../views/PlayersList.vue';
import TirageLoterie from '../views/TirageLote.vue';
import NotFoundPage from '../views/NotFoundPage.vue';
import TirageClassementGenerate from "../views/TirageClassementGenerate.vue";
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
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFoundPage
    },
    {
        path: '/tirage-classement-generate',
        name: 'TirageClassementGenerate',
        component: TirageClassementGenerate
    },
    {
        path: '/tirage-classement-player',
        name: 'TirageClassementPlayer',
        component: TirageClassementPlayer
    },
    {
        path: '/tirage-classement-playerbot',
        name: 'TirageClassementPlayerBot',
        component: TirageClassementPlayerBot
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
