<template>
  <div class="overlay">
    <div class="popup">
      <h2>que des bots ?</h2>
      <p>voulez-vous jouer qu'avec des joueurs générés ?</p>
      <div class="button-container">
        <button @click="onYes" class="button yes">Oui</button>
        <button @click="onNo" class="button no">Non</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmationPopup', // Nom du composant
  emits: ['yes', 'no'], // Événements émis
  methods: {
    onYes() {
      this.$emit('yes'); // Émet l'événement 'yes'
    },
    onNo() {
      this.$emit('no'); // Émet l'événement 'no'
    }
  }
};
</script>

<style scoped>
</style>
