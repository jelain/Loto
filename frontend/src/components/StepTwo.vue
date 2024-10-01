<!-- StepTwo.vue -->
<template>
  <div class="step">

    <form @submit.prevent="submitStepTwo">
      <!-- Affichage de la grid (chiffres sélectionnés) -->
      <p>Chiffres sélectionnés : {{ main.join(', ') }} star:{{ star.join(', ') }}</p>

      <div class="grid-container">
        <!-- grid principale avec 49 chiffres -->
        <number-grid
            class="main"
            :grid="main"
            :totalNumbers="maxMainGrid"
            :maxSelection="5"
            @number-selected="selectNumber('main', $event)">
        </number-grid>

        <!-- grid "étoile" avec 9 chiffres -->
        <number-grid
            class="star"
            :grid="star"
            :totalNumbers="maxStarGrid"
            :maxSelection="2"
            @number-selected="selectNumber('star', $event)">
        </number-grid>
      </div>

      <!-- Affichage des erreurs et chiffres sélectionnés -->
      <div v-if="error" class="error">{{ error }}</div>

      <!-- Boutons pour générer une grid aléatoire -->
      <button type="button" @click="generateTwoGrid(maxMainGrid, maxStarGrid)">Générer une grille</button>

      <button type="submit" :disabled="main.length !== 5 || star.length !== 2">Créer l'Utilisateur</button>
    </form>
  </div>
</template>

<script>
import NumberGrid from './NumberGrid.vue';

export default {
  name: 'StepTwo',
  components: {
    NumberGrid
  },
  data() {
    return {
      main: [], // Stocke les 5 chiffres sélectionnés pour la grid principale
      star: [], // Stocke les 2 chiffres sélectionnés pour la grid "étoile"
      error: null,
      maxMainGrid: 49,  // Nombre total pour la première grid
      maxStarGrid: 9,  // Nombre total pour la deuxième grid ("étoile")
    };
  },
  methods: {
    // Sélectionner un nombre dans la grid ou la grid "étoile"
    selectNumber(type, num) {
      const list = this[type]; // Accéder à grid principal ou étoile en fonction du type
      const maxLength = type === 'main' ? 5 : 2; // Limite du nombre en fonction de la grid (5 pour grid, 2 pour étoile)
      const index = list.indexOf(num); // Index de (num) dans la grid

      if (index !== -1) {
        // Si le nombre est déjà sélectionné, on le retire et on mémorise son index
        list.splice(index, 1);
        this.indexDeselectionne = index; // Stocker l'index du chiffre retiré
      } else {
        // Si le nombre n'est pas sélectionné
        if (list.length < maxLength) {
          // Si l'index d'un chiffre désélectionné existe, on insère à cette position
          if (this.indexDeselectionne !== null) {
            list.splice(this.indexDeselectionne, 0, num);
            this.indexDeselectionne = null; // Réinitialiser après insertion
          } else {
            list.push(num); // Ajouter à la fin de la liste
          }
        } else {
          // Si la grid est pleine, on remplace le dernier chiffre
          list[list.length - 1] = num; // Remplacer le dernier élément
        }
      }
      this[type] = [...list]; // Mettez à jour la liste
    },

    generateTwoGrid(first, second) {
      this.generateGrid(first, 'main');  // Générer pour la grid principale
      this.generateGrid(second, 'star'); // Générer pour la grid des étoiles
    },
    
    // Générer des chiffres aléatoires uniques pour les grids
    generateGrid(max, type) {
      const uniqueNumbers = []; // Tableau pour les nombres uniques
      // Détermine la limite en fonction du type (grid ou autre)
      const limit = type === 'main' ? 5 : 2;  // Limiter à 5 ou 2 selon le type
      // Continue à ajouter des nombres jusqu'à atteindre la limite
      while (uniqueNumbers.length < limit) {
        const randomNum = Math.floor(Math.random() * max) + 1; // Génère un nombre aléatoire entre 1 et max
        // Vérifie si le nombre n'est pas déjà dans le tableau
        if (!uniqueNumbers.includes(randomNum)) {
          uniqueNumbers.push(randomNum); // Ajoute le nombre au tableau
        }
      }
      // Stocke les nombres uniques dans this[type]
      this[type] = uniqueNumbers; // Assigne le tableau directement à this[type]
    },

    // Validation du formulaire
    submitStepTwo() {
      if (this.main.length !== 5 || this.star.length !== 2) {
        this.error = 'Veuillez sélectionner 5 chiffres et 2 étoiles.';
        return;
      }
      // Passer les deux grid au parent (CreateUser)
      this.$emit('step2-completed', { main: this.main, star: this.star });
      this.error = null;
    }
  }
};
</script>

<style scoped>

.step .main{
  display: grid;
  grid-template-columns: repeat(7, 1fr); /* 7 colonnes pour la grid */
  gap: 10px;
}
.step .star{
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 7 colonnes pour la grid */
  gap: 10px;
  grid-auto-rows: min-content;
}

.grid-container {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.error {
  color: red;
  margin-top: 10px;
}

button[type="submit"] {
  margin-top: 10px;
}

</style>
