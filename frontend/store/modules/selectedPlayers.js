const state = {
    selectedPlayers: [] // État initial
};

const getters = {
    selectedPlayers: (state) => state.selectedPlayers // Getter pour accéder aux joueurs sélectionnés
};

const actions = {
    updateSelectedPlayers({ commit }, players) {
        commit('SET_SELECTED_PLAYERS', players); // Appel à la mutation pour mettre à jour l'état
    }
};

const mutations = {
    SET_SELECTED_PLAYERS(state, players) {
        state.selectedPlayers = players; // Met à jour l'état avec les joueurs fournis
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
