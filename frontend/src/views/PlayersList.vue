<template>
  <div class="container players-list">
    <div class="header">
      <h1>Joueurs</h1>
      <div class="button-container">
        <router-link to="/players/create" class="button">
          <i class="fa-solid fa-plus"></i>
        </router-link>
        <button @click="deleteSelectedPlayers" class="button">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
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
        selected: false,
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
     * Basculer l'état de sélection d'un joueur.
     *
     * @param {Object} player - L'objet joueur dont l'état de sélection doit être basculé.
     * @returns {void} - Pas de valeur de retour.
     */
    togglePlayerSelection(player) {
      player.selected = !player.selected; // Change l'état de sélection
      const playerCopy = { ...player }; // Créer une copie de l'objet joueur

      if (player.selected) {
        const newSelection = [...this.selectedPlayers, playerCopy]; // Ajouter le joueur à la sélection
        this.updateSelectedPlayers(newSelection); // Mettre à jour les joueurs sélectionnés
      } else {
        const updatedSelection = this.selectedPlayers.filter(p => p.pseudo !== player.pseudo); // Retirer le joueur de la sélection
        this.updateSelectedPlayers(updatedSelection); // Mettre à jour les joueurs sélectionnés
      }
    },

    /**
     * Supprime les joueurs sélectionnés ou tous les joueurs si aucun n'est sélectionné.
     *
     * @returns {Promise<void>} - Une promesse qui se résout lorsque le processus de suppression est terminé.
     */
    async deleteSelectedPlayers() {
      // Récupérer les pseudos des joueurs sélectionnés
      const selectedPlayerPseudos = this.players
          .filter(player => player.selected)
          .map(player => player.pseudo); // Utilisation des pseudos au lieu des IDs

      if (selectedPlayerPseudos.length === 0) {
        const confirmDelete = confirm("Aucun joueur sélectionné. Voulez-vous vraiment supprimer tous les joueurs ?");
        if (!confirmDelete) return; // Sortir si l'utilisateur annule la suppression

        // Appel pour supprimer tous les joueurs
        try {
          const response = await axios.delete('http://localhost:5001/api/users/delete', {
            data: { pseudos: [] } // Envoyer un tableau vide pour supprimer tous les joueurs
          });
          this.players = []; // Vider la liste des joueurs
          this.updateSelectedPlayers([]); // Réinitialiser les joueurs sélectionnés dans Vuex
          alert(response.data.message); // Afficher le message de succès
        } catch (error) {
          console.error('Erreur lors de la suppression de tous les joueurs:', error);
          alert('Erreur lors de la suppression de tous les joueurs.'); // Afficher le message d'erreur
        }
        return; // Sortir de la méthode après la suppression de tous les joueurs
      }

      // Suppression des joueurs sélectionnés
      try {
        const response = await axios.delete('http://localhost:5001/api/users/delete', {
          data: { pseudos: selectedPlayerPseudos } // Passer les pseudos sélectionnés
        });

        // Mettre à jour la liste des joueurs pour exclure ceux qui ont été supprimés
        this.players = this.players.filter(player => !player.selected);
        // Mettre à jour les joueurs sélectionnés dans Vuex
        this.updateSelectedPlayers(this.selectedPlayers.filter(p => !selectedPlayerPseudos.includes(p.pseudo)));

        alert(response.data.message); // Afficher le message de succès
      } catch (error) {
        console.error('Erreur lors de la suppression des joueurs:', error);
        alert('Erreur lors de la suppression des joueurs.'); // Afficher le message d'erreur
      }
    }

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

.button-container {
  display: flex; /* Centre le bouton dans le conteneur */
  gap: 1rem;
  flex-direction: row-reverse;
}
</style>
