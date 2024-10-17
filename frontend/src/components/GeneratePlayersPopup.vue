<template>
  <div class="overlay">
    <div class="popup">
      <h2>plus de joueurs ?</h2>
      <p>Combien de joueur souhaitez-vous générer ?</p>
      <div class="input-container">
        <input type="number" v-model.number="players" min="1" />
      </div>
      <div class="button-container">
        <button @click="onGenerate" class="button start">Générer et lancer le tirage</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GeneratePlayersPopup', // Nom du composant
  data() {
    return {
      players: 1 // Nombre de joueurs à générer, initialisé à 1
    };
  },
  emits: ['generate'], // Événement émis lors de la génération
  methods: {
    /**
     * Méthode appelée lors du clic sur le bouton "Générer et lancer le tirage".
     * Émet l'événement 'generate' avec le nombre de joueurs spécifié si ce nombre est valide (supérieur à 0).
     * Sinon, affiche une alerte demandant un nombre valide.
     * @returns {void}
     */
    onGenerate() {
      if (this.players > 0) {
        this.$emit('generate', this.players); // Émet l'événement avec le nombre de joueurs
      } else {
        alert('Veuillez entrer un nombre valide.'); // Alerte si le nombre est invalide
      }
    }
  }
};
</script>

<style scoped>
</style>
