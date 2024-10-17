<template>
  <div v-if="gridData" class="grid-container">
    <div class="grid">
      <!-- Affiche chaque chiffre de la grille individuellement -->
      <div v-for="(number, index) in gridData.main" :key="index" class="number">
        <p>{{ number }}</p>
      </div>
      <div v-for="(etoile, index) in gridData.stars" :key="index" class="number star">
        <p>{{ etoile }}</p>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Aucune grille n'a été générée.</p>
  </div>
</template>

<script>
export default {
  name: 'GenerateGrid',
  props: {
    gridData: {
      type: Object,
      default: null
    }
  }
};
</script>

<style scoped>
.grid-container {
  text-align: center;
  margin: 20px;
}

.numbers {
  margin-top: 10px;
  font-size: 18px;
}

.button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #2d4044;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.button:hover {
  background-color: #3a5054;
}

.number {
  width: 5rem;
  height: 5rem;
  font-size: 2rem;
}

.number.star {
  border: 1.3px solid #CDA462;
}
</style>
