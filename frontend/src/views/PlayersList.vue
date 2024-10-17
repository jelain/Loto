<template>
  <div class="container players-list">
    <div class="header">
      <h1>Joueurs</h1>
      <router-link to="/players/create" class="button">
        <i class="fa-solid fa-plus"></i>
      </router-link>
    </div>
    <table v-if="players.length > 0">
      <thead>
      <tr>
        <th></th>
        <th>Pseudo</th>
        <th>Grille</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="player in players" :key="player.id">
        <td>
          <input
              type="checkbox"
              :checked="player.selected"
              @change="togglePlayerSelection(player)"
          />
        </td>
        <td>{{ player.pseudo }}</td>
        <td>
          <div class="grid">
            <div v-for="(number, index) in player.grille" :key="index" class="number">
              <p>{{ number }}</p>
            </div>
            <div v-for="(etoile, index) in player.etoile" :key="index" class="number star">
              <p>{{ etoile }}</p>
            </div>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
    <p v-else>Aucun joueur trouvé.</p>
  </div>
</template>

<script>
import axios from 'axios';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'PlayersList',
  data() {
    return {
      players: [],
    };
  },
  computed: {
    ...mapGetters('selectedPlayers', ['selectedPlayers']),
  },
  async created() {
    try {
      const response = await axios.get('http://localhost:5001/api/users/players');
      this.players = response.data.map(player => ({
        ...player,
        selected: false
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des joueurs:', error);
      alert('Erreur lors de la récupération des joueurs.');
    }
  },
  async mounted() {
    this.updateSelectedPlayers([]);
  },
  methods: {
    ...mapActions('selectedPlayers', ['updateSelectedPlayers']),

    /**
     * Inverse l'état de sélection d'un joueur et met à jour la sélection dans Vuex.
     * @param {Object} player - L'objet joueur dont l'état de sélection doit être inversé.
     * @returns {void}
     */
    togglePlayerSelection(player) {
      player.selected = !player.selected;
      const playerCopy = { ...player };

      if (player.selected) {
        const newSelection = [...this.selectedPlayers, playerCopy];
        this.updateSelectedPlayers(newSelection);
      } else {
        const updatedSelection = this.selectedPlayers.filter(p => p.pseudo !== player.pseudo);
        this.updateSelectedPlayers(updatedSelection);
      }
    },
  },
};
</script>

<style scoped>
.header{
  display: flex;
  justify-content: space-between;
}

th{
  font-weight: normal;
  background-color: #ececec;
  text-transform: capitalize;
}

tr:nth-child(even) {
  background-color: #ececec;
}

tr:nth-child(odd) {
  background-color: #F4F4F4;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 3em;
}

th, td {
  border: none;
  text-align: center;
  height: 3em;
}

tr {
  border-radius: 50px;
}

th:first-child, td:first-child {
  border-top-left-radius: 50px;
  border-bottom-left-radius: 50px;
}

th:last-child, td:last-child {
  border-top-right-radius: 50px;
  border-bottom-right-radius: 50px;
}

.grid{
  justify-content: center;
}

input[type="checkbox"] {
  width: 3rem;
}
</style>
