<template>
  <div class="step">
    <form @submit.prevent="submitStepOne">
      <div>
        <label for="pseudo">Pseudo :</label>
        <input type="text" id="pseudo" v-model="pseudo" required />
      </div>
      <div v-if="error" class="error">{{ error }}</div>
      <button type="submit">Étape Suivante</button>
    </form>
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
    submitStepOne() {
      if (this.pseudo.trim() === '') {
        this.error = 'Le pseudo est requis.';
        return;
      }
      // Passer le pseudo au parent (CreateUser)
      this.$emit('step1-completed', this.pseudo.trim());
    }
  }
};
</script>

<style scoped>
.step {
  max-width: 400px;
  margin: 0 auto;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
