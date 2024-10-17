<template>
  <div class="step">
    <h1>Ajouter un joueur</h1>
    <form @submit.prevent="submitStepOne">
      <div>
        <input type="text" id="pseudo" placeholder="Saisir un pseudo" v-model="pseudo" required />
      </div>
      <button type="submit" class="button">
        <i class="fa-solid fa-check"></i>
      </button>
    </form>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script>
export default {
  name: 'StepOne',
  data() {
    return {
      pseudo: '',
      error: null
    };
  },
  methods: {
    /**
     * Valide le pseudo saisi et émet un événement si la validation est réussie.
     * @returns {void}
     */
    submitStepOne() {
      if (this.pseudo.trim() === '') {
        this.error = 'Le pseudo est requis.'; // Affiche un message d'erreur si le pseudo est vide
        return;
      }
      // Passer le pseudo au parent (CreateUser)
      this.$emit('step1-completed', this.pseudo.trim()); // Émet l'événement avec le pseudo trimé
    }
  }
};
</script>

<style scoped>
.error {
  color: red;
  margin-top: 10px;
}

form {
  display: flex;
  justify-content: center;
  margin-top: 6rem;
  gap: 1rem;
}
</style>
