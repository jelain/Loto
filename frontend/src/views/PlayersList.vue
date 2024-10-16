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
      players: [], // Liste des joueurs récupérés
    };
  },
  computed: {
    ...mapGetters('selectedPlayers', ['selectedPlayers']), // Récupération des joueurs sélectionnés de Vuex
  },
  async created() {
    try {
      const response = await axios.get('http://localhost:5001/api/users/players');
      // Récupération des joueurs, par défaut selected est à false
      this.players = response.data.map(player => ({
        ...player,
        selected: false // Assurez-vous que par défaut, chaque joueur est décoché
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des joueurs:', error);
      alert('Erreur lors de la récupération des joueurs.');
    }
  },
  async mounted() {
    // Vider le tableau des joueurs sélectionnés dans Vuex
    this.updateSelectedPlayers([]); // Réinitialiser selectedPlayers à vide
  },
  methods: {
    ...mapActions('selectedPlayers', ['updateSelectedPlayers']), // Action pour mettre à jour les joueurs sélectionnés

    togglePlayerSelection(player) {
      // Inverse l'état local du joueur
      player.selected = !player.selected;

      // Créer une copie de l'objet joueur pour éviter les mutations indésirables
      const playerCopy = { ...player }; // Clone du joueur pour ajouter à selectedPlayers

      console.log(`Changement de sélection pour ${player.pseudo}: ${player.selected}`);
      console.log('Objet player:', player); // Ajouté pour voir la structure de player

      if (player.selected) {
        // Si le joueur est sélectionné, l'ajouter à Vuex
        const newSelection = [...this.selectedPlayers, playerCopy]; // Ajoute le joueur à la sélection
        console.log("Ajouté à la sélection: ", playerCopy);
        this.updateSelectedPlayers(newSelection); // Met à jour Vuex
      } else {
        // Si le joueur est décoché, le retirer de Vuex par pseudo
        const updatedSelection = this.selectedPlayers.filter(p => p.pseudo !== player.pseudo); // Filtre le joueur par pseudo
        console.log("Retiré de la sélection: ", player.pseudo); // Vérifie si player.pseudo est bien défini
        console.log("Sélection mise à jour: ", updatedSelection);
        this.updateSelectedPlayers(updatedSelection); // Met à jour Vuex
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
  background-color: #ececec; /* Gris clair */
}

tr:nth-child(odd) {
  background-color: #F4F4F4; /* Fond */
}

table {
  width: 100%;
  border-collapse: separate; /* Nécessaire pour que le border-radius fonctionne */
  border-spacing: 0; /* Évite les espaces entre les cellules */
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