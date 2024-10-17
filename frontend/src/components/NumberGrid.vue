<!-- NumberGrid.vue -->
<template>
  <div class="grid">
    <button
        v-for="num in totalNumbers"
        :key="num"
        :class="[
          'number-button',
          {
            selected: isNumberSelected(num),
            'star-button': gridType === 'star'
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
    grid: {
      type: Array,
      required: true
    },
    totalNumbers: {
      type: Number,
      required: true
    },
    maxSelection: {
      type: Number,
      required: true,
      default: 5
    },
    gridType: {
      type: String,
      required: true,
      default: 'main'
    }
  },
  methods: {
    /**
     * Vérifie si un numéro particulier (num) est déjà sélectionné dans la grille.
     * @param {Number} num - Le numéro à vérifier.
     * @returns {Boolean} - Renvoie true si le numéro est sélectionné, sinon false.
     */
    isNumberSelected(num) {
      return this.grid.includes(num);
    },

    /**
     * Sélectionne un numéro et émet un événement 'number-selected'.
     * @param {Number} num - Le numéro sélectionné.
     * @returns {void}
     */
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
  background-color: #ffffff;
  border-radius: 100px;
  border: none;
  transition: background-color 0.3s;
  width: 3rem;
  height: 3rem;
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

.number-button.star-button {
  background-color: #FFFFFF;
  color: #CDA462;
  border: solid 1px #CDA462;
}

.number-button.star-button.selected {
  background-color: #CDA462;
  color: #ffffff;
}

.number-button:not(.selected):disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>