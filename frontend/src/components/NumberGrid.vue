<!-- NumberGrid.vue -->
<template>
  <div class="grid">
    <!-- Générer des boutons selon le nombre spécifié par la prop totalNumbers -->
    <button
        v-for="num in totalNumbers"
        :key="num"
        :class="['number-button', { selected: isNumberSelected(num) }]"
        @click.prevent="selectNumber(num)"
        :disabled="grid.length >= maxSelection && !isNumberSelected(num)"
    >
      {{ num }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'NumberGrid',
  props: {
    // la grille contenant les chiffre selectionné
    grid: {
      type: Array,
      required: true
    },
    // Nombre de chiffre
    totalNumbers: {
      type: Number,
      required: true
    },
    // Nombre de chiffre selectionnable, par défaut: 5
    maxSelection: {
      type: Number,
      required: true,
      default: 5 // Valeur par défaut
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

.number-button {
  padding: 10px;
  text-align: center;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 100px;
  transition: background-color 0.3s;
  width: 3em;
  height: 3em;
}

.number-button.selected {
  background-color: #4CAF50; /* Vert pour les chiffres sélectionnés */
  color: white;
}

.number-button:not(.selected):disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
