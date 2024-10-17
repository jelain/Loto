<template>
  <div class="container tirage-classement">
    <h1>Tirage</h1>
    <div class="grid-container">
      <generate-grid :grid-data="gridData" :winning-grid="gridData"></generate-grid>
    </div>

    <div v-if="winners.length > 0" class="winners-list">
      <h3>Les gagnants :</h3>
      <table>
        <thead>
        <tr>
          <th> </th>
          <th>Pseudo</th>
          <th>Grille</th>
          <th>Gain</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(winner, index) in winners" :key="index">
          <td class="pos">{{ index + 1 }}</td>
          <td>{{ winner.pseudo }}</td>
          <td>
            <div class="grid">
              <div v-for="(number, index) in winner.grille" :key="index" class="number" :class="{'match': isNumberInGeneratedGrid(number)}">
                <p>{{ number }}</p>
              </div>
              <div v-for="(etoile, index) in winner.etoile" :key="index" class="number star" :class="{'match': isStarInGeneratedStars(etoile)}">
                <p>{{ etoile }}</p>
              </div>
            </div>
          </td>
          <td>{{ calculateWinnings(index) }} €</td>
        </tr>
        </tbody>
      </table>
    </div>
    <p v-else>Aucun gagnant pour le moment.</p>
  </div>
</template>

<script>
import GenerateGrid from "../components/GenerateGrid.vue"; // Importation du composant GenerateGrid
import axios from 'axios'; // Importation d'Axios pour les requêtes HTTP
import { mapGetters } from 'vuex'; // Importation des getters de Vuex

export default {
  name: 'TirageClassementPlayer', // Nom du composant
  components: { GenerateGrid }, // Déclaration des composants
  data() {
    return {
      gridData: null, // Données de la grille gagnante
      players: [], // Liste des joueurs
      winners: [], // Liste des gagnants
      totalPrize: 3000000, // Montant total du prix à distribuer
      rankPercentages: [0.4, 0.2, 0.12, 0.07, 0.06, 0.05, 0.04, 0.03, 0.02, 0.01], // Pourcentages des gains selon le rang
    };
  },
  computed: {
    ...mapGetters('selectedPlayers', ['selectedPlayers']), // Récupérer les joueurs sélectionnés de Vuex
  },
  created() {
    // À la création du composant, récupérer la grille gagnante du localStorage
    const savedGrid = localStorage.getItem('generatedGrid');
    if (savedGrid) {
      this.gridData = JSON.parse(savedGrid); // Charger les données de la grille
      console.log("Grille gagnante chargée:", this.gridData);
      this.fetchPlayers(); // Récupérer les joueurs
    } else {
      this.gridData = null; // Pas de grille trouvée
      console.error("Aucune grille gagnante trouvée dans le localStorage.");
    }
  },
  methods: {
    /**
     * Récupère la liste des joueurs depuis l'API ou depuis Vuex.
     * @returns {Promise<void>}
     */
    async fetchPlayers() {
      // Vérifier si selectedPlayers est vide
      if (this.selectedPlayers.length === 0) {
        // Utiliser l'API pour récupérer les joueurs
        const response = await axios.get('http://localhost:5001/api/users/players');
        this.players = response.data; // Stocker les joueurs dans le tableau
      } else {
        // Utiliser les joueurs sélectionnés dans Vuex
        this.players = this.selectedPlayers; // Stocker les joueurs sélectionnés
      }
      this.calculateWinners(); // Calculer les gagnants
    },

    /**
     * Calcule les gagnants en fonction des grilles des joueurs et les trie.
     * @returns {void}
     */
    calculateWinners() {
      // Identifier les gagnants
      this.winners = this.players.map(player => {
        const mainMatches = this.getMatches(this.gridData.main, player.grille); // Trouver les matches principaux
        const starMatches = this.getMatches(this.gridData.stars, player.etoile); // Trouver les matches d'étoiles
        return { ...player, mainMatches, starMatches }; // Retourner les détails du joueur avec les matches
      })
          .sort((a, b) => {
            // Trier les gagnants par nombre de matches
            if (b.mainMatches !== a.mainMatches) return b.mainMatches - a.mainMatches; // Comparer les matches principaux
            if (b.starMatches !== a.starMatches) return b.starMatches - a.starMatches; // Comparer les matches d'étoiles
            // Comparer les différences d'étoiles en cas d'égalité
            const diffA = Math.abs(b.etoile[0] - a.etoile[0]);
            const diffB = Math.abs(b.etoile[0] - a.etoile[0]);
            return diffA - diffB;
          })
          .slice(0, 10); // Garder uniquement les 10 premiers gagnants
    },

    /**
     * Compte combien de numéros dans la grille du joueur correspondent aux numéros générés.
     * @param {Array<number>} generated - Les numéros générés (grille gagnante).
     * @param {Array<number>} playerGrid - Les numéros de la grille du joueur.
     * @returns {number} - Le nombre de matches.
     */
    getMatches(generated, playerGrid) {
      return generated.filter(num => playerGrid.includes(num)).length; // Retourne le nombre de matches
    },

    /**
     * Vérifie si un numéro est dans la grille gagnante.
     * @param {number} num - Le numéro à vérifier.
     * @returns {boolean} - True si le numéro est dans la grille, sinon false.
     */
    isNumberInGeneratedGrid(num) {
      return this.gridData.main.includes(num); // Vérifie si le numéro est dans la grille principale
    },

    /**
     * Vérifie si une étoile est dans la grille gagnante.
     * @param {number} star - L'étoile à vérifier.
     * @returns {boolean} - True si l'étoile est dans la grille, sinon false.
     */
    isStarInGeneratedStars(star) {
      return this.gridData.stars.includes(star); // Vérifie si l'étoile est dans la grille des étoiles
    },

    /**
     * Calcule le montant des gains pour un gagnant donné.
     * @param {number} index - L'index du gagnant dans la liste des gagnants.
     * @returns {string} - Le montant des gains formaté en euros.
     */
    calculateWinnings(index) {
      const currentWinner = this.winners[index]; // Obtenir le gagnant actuel
      const totalWinners = this.winners.length; // Nombre total de gagnants

      // Cas où il y a moins de 10 joueurs
      if (totalWinners < 10) {
        // Calculer la somme des pourcentages pour les gagnants
        const percentages = this.rankPercentages.slice(0, totalWinners); // Obtenir les pourcentages pour les gagnants
        const totalPercentage = percentages.reduce((sum, value) => sum + value, 0); // Somme des pourcentages

        // Vérifier les gagnants à égalité
        const tiedWinners = this.winners.filter(winner =>
            winner.mainMatches === currentWinner.mainMatches &&
            winner.starMatches === currentWinner.starMatches
        );

        if (tiedWinners.length > 1) {
          // Trouver les indices des gagnants égaux
          const tiedIndices = this.winners.reduce((acc, winner, idx) => {
            if (winner.mainMatches === currentWinner.mainMatches && winner.starMatches === currentWinner.starMatches) {
              acc.push(idx); // Ajouter l'indice à la liste des indices
            }
            return acc;
          }, []);

          // Calculer la somme des pourcentages pour ces positions
          const tiedPercentageSum = tiedIndices.reduce((sum, idx) => sum + percentages[idx], 0);

          // Calculer la part de chaque gagnant égal
          return (this.totalPrize * (tiedPercentageSum / totalPercentage / tiedWinners.length)).toFixed(2); // Retourner les gains formatés
        } else {
          // Si pas d'égalité, utiliser le pourcentage pour le gagnant
          return (this.totalPrize * (this.rankPercentages[index] / totalPercentage)).toFixed(2); // Retourner les gains formatés
        }
      } else {
        // Cas où il y a 10 joueurs ou plus
        const tiedWinners = this.winners.filter(winner =>
            winner.mainMatches === currentWinner.mainMatches &&
            winner.starMatches === currentWinner.starMatches
        );

        if (tiedWinners.length > 1) {
          const tiedIndices = this.winners.reduce((acc, winner, idx) => {
            if (winner.mainMatches === currentWinner.mainMatches && winner.starMatches === currentWinner.starMatches) {
              acc.push(idx); // Ajouter l'indice à la liste des indices
            }
            return acc;
          }, []);

          // Calculer la somme des pourcentages pour ces positions
          const totalPercentage = tiedIndices.reduce((sum, idx) => sum + this.rankPercentages[idx], 0);

          // Calculer la part de chaque gagnant égal
          return (this.totalPrize * (totalPercentage / tiedWinners.length)).toFixed(2); // Retourner les gains formatés
        } else {
          // Si pas d'égalité, utiliser le pourcentage pour le gagnant
          return (this.totalPrize * this.rankPercentages[index]).toFixed(2); // Retourner les gains formatés
        }
      }
    }
  }
};
</script>

<style scoped>
/* Styles existants non modifiés */
.grid-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 15rem;
}

.winners-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.winners-table th, .winners-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

.winners-table th {
  background-color: #f2f2f2;
}

.match {
  font-weight: bold;
}

@media (max-width: 768px) {
  .winners-table, .winners-table th, .winners-table td {
    font-size: 12px;
  }
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

.pos{
  padding-left: 1em;
}
</style>
