<!-- NumberGrid.vue -->
<template>
  <div class="grid">
    <!-- Générer des boutons selon le nombre spécifié par la prop totalNumbers -->
    <button
        v-for="num in totalNumbers"
        :key="num"
        :class="[
        'number-button',
        {
          selected: isNumberSelected(num),
          'star-button': gridType === 'star' // Classe conditionnelle
        }
      ]"
        @click.prevent="selectNumber(num)"
        :disabled="grid.length >= maxSelection && !isNumberSelected(num) && !grid.includes(null)"
    >
      <p class="number">{{ num }}</p>
    </button>
  </div>
</template>

<script>
export default {
  name: 'NumberGrid',
  props: {
    // La grille contenant les chiffres sélectionnés
    grid: {
      type: Array,
      required: true
    },
    // Nombre total de chiffres dans la grille
    totalNumbers: {
      type: Number,
      required: true
    },
    // Nombre de chiffres sélectionnables
    maxSelection: {
      type: Number,
      required: true,
      default: 5 // Valeur par défaut
    },
    // Type de grille: 'main' ou 'star'
    gridType: {
      type: String,
      required: true,
      default: 'main'
    }
  },
  methods: {
    // Vérifie si un numéro particulier (num) est déjà sélectionné dans la grille
    isNumberSelected(num) {
      return this.grid.includes(num);
    },
    selectNumber(num) {
      this.$emit('number-selected', num);
    }
  }
};
</script>

<style scoped>
.number {
  font-size: 1rem;
  background: none;
}

.number-button {
  padding: 10px;
  text-align: center;
  background-color: #ffffff; /* Couleur par défaut */
  border-radius: 100px;
  border: none;
  transition: background-color 0.3s;
  width: 4em;
  height: 4em;
  display: flex;
  justify-content: center;
  align-items: center;
}

.number-button.selected {
  background-color: #2d4044;
}

.number-button.selected .number {
  color: #ffffff;
}

/* Style spécifique pour la grille "star" */
.number-button.star-button {
  background-color: #FFFFFF; /* Fond blanc pour les boutons de la grille "star" */
  color: #CDA462;
  border: solid 1px #CDA462;
}

.number-button.star-button.selected {
  background-color: #CDA462; /* Optionnel: une autre couleur pour les boutons sélectionnés */
  color: #ffffff;
}

.number-button:not(.selected):disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>