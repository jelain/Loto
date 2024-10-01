<template>
  <div class="create-user">
    <component
        :is="currentStepComponent"
        @step1-completed="handleStep1Completed"
        @step2-completed="handleStep2Completed"
        v-if="!isSuccess"
    ></component>
    <SuccessPage v-else :pseudo="pseudo" />
  </div>
</template>

<script>
import StepOne from '../components/StepOne.vue';
import StepTwo from '../components/StepTwo.vue';
import SuccessPage from '../components/SuccessPage.vue';
import axios from 'axios';
import HeaderNav from "../components/HeaderNav.vue";

export default {
  name: 'CreateUser',
  components: {
    HeaderNav,
    StepOne,
    StepTwo,
    SuccessPage
  },
  data() {
    return {
      currentStep: 1,
      pseudo: '',
      main: [],
      star: [],
      isSuccess: false
    };
  },
  computed: {
    currentStepComponent() {
      if (this.currentStep === 1) return 'StepOne';
      if (this.currentStep === 2) return 'StepTwo';
      return null;
    }
  },
  methods: {
    handleStep1Completed(pseudo) {
      this.pseudo = pseudo;
      this.currentStep = 2;
    },
    async handleStep2Completed(grid) {
      this.main = grid.main;
      this.star = grid.star;
      // Envoyer les données au backend pour créer l'utilisateur
      try {
        const response = await axios.post('http://localhost:5001/api/users', {
          pseudo: this.pseudo,
          grille: this.main,
          etoile: this.star,
        });
        console.log(response.data);
        this.isSuccess = true;

        // Après 2 secondes, rediriger vers la page d'accueil
        setTimeout(() => {
          this.$router.push('/');  // Redirection vers la page d'accueil apres 2s
        }, 2000);

      } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error.response ? error.response.data : error.message);
        alert(error.response && error.response.data && error.response.data.message ? error.response.data.message : 'Erreur lors de la création de l\'utilisateur.');
      }
    }
  }
};
</script>

<style scoped>
.create-user {
  padding: 20px;
}
</style>
