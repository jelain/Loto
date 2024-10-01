<template>
  <div class="players-list">
    <h1>Liste des joueurs</h1>
    <ol v-if="players.length > 0">
      <li v-for="player in players" :key="player.id">
        <strong>{{ player.pseudo }}</strong>
        <div class="grille">
          Grille:
          {{player.grille}}
          <strong>{{player.etoile}}</strong>
        </div>
      </li>
    </ol>
    <p v-else>Aucun joueur trouvé.</p>
  </div>
  <router-link to="/create-user">Créer un joueur</router-link>
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
.players-list {
  padding: 20px;
}
.players-list .grille{
  display: flex;
  gap: 10px;
}

.grille strong{
  color: red;
}
</style>
