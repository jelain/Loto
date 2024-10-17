<template>
  <div class="step">
    <h1>Choisissez vos numéros</h1>
    <div class="my-grid">
      <p>ma grille :</p>
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
          <number-grid
              class="main"
              :grid="main"
              :totalNumbers="maxMainGrid"
              :maxSelection="5"
              gridType="main"
              @number-selected="selectNumber('main', $event)">
          </number-grid>
          <number-grid
              class="star"
              :grid="star"
              :totalNumbers="maxStarGrid"
              :maxSelection="2"
              gridType="star"
              @number-selected="selectNumber('star', $event)">
          </number-grid>
        </div>

        <div v-if="error" class="error">{{ error }}</div>

        <div class="buttons-container">
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
      main: [null, null, null, null, null],
      star: [null, null],
      error: null,
      maxMainGrid: 49,
      maxStarGrid: 9,
    };
  },
  methods: {
    /**
     * Sélectionne un nombre dans la grille principale ou étoile.
     * @param {string} type - Type de grille ('main' ou 'star').
     * @param {number} num - Le numéro sélectionné.
     * @returns {void}
     */
    selectNumber(type, num) {
      const list = this[type];
      const maxLength = type === 'main' ? 5 : 2;
      const index = list.indexOf(num);

      if (index !== -1) {
        list[index] = null; // Désélectionne le nombre
      } else {
        if (list.filter(item => item !== null).length < maxLength) {
          const emptyIndex = list.indexOf(null);
          if (emptyIndex !== -1) {
            list[emptyIndex] = num; // Insère le numéro dans la première position libre
          } else {
            list.push(num); // Ajoute le numéro à la fin
          }
        } else {
          const lastIndex = list.lastIndexOf(null) !== -1 ? list.lastIndexOf(null) : list.length - 1;
          list[lastIndex] = num; // Remplace le dernier élément non null
        }
      }
      this[type] = [...list]; // Met à jour la liste
    },

    /**
     * Génère des grilles pour les chiffres principaux et étoiles.
     * @param {number} first - Le nombre total pour la grille principale.
     * @param {number} second - Le nombre total pour la grille des étoiles.
     * @returns {void}
     */
    generateTwoGrid(first, second) {
      this.generateGrid(first, 'main');
      this.generateGrid(second, 'star');
    },

    /**
     * Génère des chiffres aléatoires uniques pour une grille donnée.
     * @param {number} max - Le nombre maximal de la grille.
     * @param {string} type - Type de grille ('main' ou 'star').
     * @returns {void}
     */
    generateGrid(max, type) {
      const uniqueNumbers = [];
      const limit = type === 'main' ? 5 : 2;
      while (uniqueNumbers.length < limit) {
        const randomNum = Math.floor(Math.random() * max) + 1;
        if (!uniqueNumbers.includes(randomNum)) {
          uniqueNumbers.push(randomNum);
        }
      }
      this[type] = uniqueNumbers; // Assigne les numéros uniques à la grille correspondante
    },

    /**
     * Valide le formulaire et émet les chiffres sélectionnés au parent.
     * @returns {void}
     */
    submitStepTwo() {
      if (this.main.length !== 5 || this.star.length !== 2) {
        this.error = 'Veuillez sélectionner 5 chiffres et 2 étoiles.';
        return;
      }
      this.$emit('step2-completed', { main: this.main, star: this.star });
      this.error = null; // Réinitialise l'erreur
    }
  }
};
</script>

<style scoped>
.step {
  display: flex;
  flex-direction: column;
  height: 90%;
}
.grid-container .main {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
}
.grid-container .star {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  grid-auto-rows: min-content;
}

.my-grid {
  display: flex;
  align-items: center;
  margin-top: 2rem;
}

.grid-container {
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

.my-grid .grid {
  align-items: center;
  margin-left: 1rem;
  border: solid 1px #2D4044;
  border-radius: 100px;
  padding: 0.5rem;
}

.buttons-container {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 5rem 10rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.button {
  width: 8rem;
  color: #2d4044;
}

.button:hover {
  background-color: #2d4044;
  color: #FFFFFF;
}
</style>
