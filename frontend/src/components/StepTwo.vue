<!-- StepTwo.vue -->
<template>
  <div class="step">
    <h1>Choisissez vos numéros</h1>
    <!-- Affichage de la grille (chiffres sélectionnés) -->
    <div class="my-grid">
      <p>ma grille :</p>
      <!-- Affiche chaque chiffre de la grille individuellement -->
      <div class="grid">
        <div v-for="(number, index) in main" :key="index" class="number">
          <p>{{ number }}</p>
        </div>
        <div v-for="(star, index) in star" :key="index" class="number star">
          <p>{{ star }}</p>
        </div>
      </div>
    </div>

    <div class="grid-container">
    <form @submit.prevent="submitStepTwo">
      <div class="select-grid-container">
        <!-- grille principale avec 49 chiffres -->
        <number-grid
            class="main"
            :grid="main"
            :totalNumbers="maxMainGrid"
            :maxSelection="5"
            gridType="main"
            @number-selected="selectNumber('main', $event)">
        </number-grid>
        <!-- grille "étoile" avec 9 chiffres -->
        <number-grid
            class="star"
            :grid="star"
            :totalNumbers="maxStarGrid"
            :maxSelection="2"
            gridType="star"
            @number-selected="selectNumber('star', $event)">
        </number-grid>
      </div>

      <!-- Affichage des erreurs et chiffres sélectionnés -->
      <div v-if="error" class="error">{{ error }}</div>

      <div class="buttons-container">
        <!-- Boutons pour générer une grid aléatoire -->
        <button type="button" @click="generateTwoGrid(maxMainGrid, maxStarGrid)" class="button">
          <p>
            générer une grille
          </p>
        </button>
        <button type="submit" :disabled="main.length !== 5 || star.length !== 2" class="button">
          <p>
            créer l'utilisateur
          </p>
        </button>
      </div>
    </form>
    </div>
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
      main: [null, null, null, null, null], // Stocke les 5 chiffres sélectionnés pour la grid principale
      star: [null, null], // Stocke les 2 chiffres sélectionnés pour la grid "étoile"
      error: null,
      maxMainGrid: 49,  // Nombre total pour la première grid
      maxStarGrid: 9,  // Nombre total pour la deuxième grid ("étoile")
    };
  },
  methods: {
    // Sélectionner un nombre dans la grid ou la grid "étoile"
    selectNumber(type, num) {
      const list = this[type]; // Accéder à la liste principale ou étoile en fonction du type
      const maxLength = type === 'main' ? 5 : 2; // Limite du nombre d'éléments en fonction de la liste (5 pour 'main', 2 pour 'étoile')
      const index = list.indexOf(num); // Index du nombre (num) dans la liste

      if (index !== -1) {
        // Si le nombre est déjà sélectionné, on le retire mais remplace par 'null'
        list[index] = null;
      } else {
        // Si le nombre n'est pas sélectionné
        if (list.filter(item => item !== null).length < maxLength) {
          // Si une position de désélection existe, on insère à cet emplacement
          const emptyIndex = list.indexOf(null);
          if (emptyIndex !== -1) {
            list[emptyIndex] = num;
          } else {
            // Sinon, on ajoute à la première position libre ou à la fin
            list.push(num);
          }
        } else {
          // Si la liste est pleine, on remplace le dernier élément non null par le nouveau numéro
          const lastIndex = list.lastIndexOf(null) !== -1 ? list.lastIndexOf(null) : list.length - 1;
          list[lastIndex] = num;
        }
      }
      this[type] = [...list]; // Mettre à jour la liste avec les modifications
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
.step{
  display: flex;
  flex-direction: column;
  height: 90%;
}
.grid-container .main{
  display: grid;
  grid-template-columns: repeat(7, 1fr); /* 7 colonnes pour la grid */
  gap: 10px;
}
.grid-container .star{
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 7 colonnes pour la grid */
  gap: 10px;
  grid-auto-rows: min-content;
}

.my-grid{
  display: flex;
  align-items: center;
  margin-top: 2rem;
}

.grid-container{
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.select-grid-container {
  display: flex;
  justify-content: center;
  gap: 3rem;
  align-items: center;
}

.error {
  color: #a53232;
  margin-top: 10px;
}

.my-grid .grid{
  align-items: center;
  margin-left: 1rem;
  border: solid 1px #2D4044;
  border-radius: 100px;
  padding: 0.5rem;
}

.buttons-container{
  position: absolute;
  bottom:  0;
  right:  0;
  padding: 5rem 10rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.button{
  width: 8rem;
  color: #2d4044;
}

.button:hover{
  background-color: #2d4044;
  color: #FFFFFF;
}
</style>