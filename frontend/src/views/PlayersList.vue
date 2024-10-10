<template>
  <div class="container players-list">
    <div class="header">
      <h1>joueurs</h1>
      <router-link to="/players/create" class="button">
        <i class="fa-solid fa-plus"></i>
      </router-link>
    </div>
    <table v-if="players.length > 0">
      <thead>
      <tr>
        <th>pseudo</th>
        <th>grille</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="player in players" :key="player.id">
        <td>{{ player.pseudo }}</td>
        <td>
          <div class="grid">
            <!-- Affiche chaque chiffre de la grille individuellement -->
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
    <p v-else>aucun joueur trouvé.</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PlayersList',
  data() {
    return {
      players: []
    };
  },
  async created() {
    try {
      const response = await axios.get('http://localhost:5001/api/users');
      this.players = response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des joueurs:', error.response ? error.response.data : error.message);
      alert('Erreur lors de la récupération des joueurs.');
    }
  }
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

</style>