import { createStore } from 'vuex';
import selectedPlayers from './modules/selectedPlayers'; // Importez votre module

const store = createStore({
    modules: {
        selectedPlayers, // Ajoutez le module ici
    },
});

export default store;
