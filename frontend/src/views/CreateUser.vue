<template>
  <div class="container create-user">
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
      currentStep: 1, // Indique l'étape actuelle du formulaire
      pseudo: '', // Stocke le pseudo saisi par l'utilisateur
      main: [], // Stocke les numéros principaux sélectionnés
      star: [], // Stocke les numéros étoiles sélectionnés
      isSuccess: false // Indique si l'utilisateur a été créé avec succès
    };
  },
  computed: {
    // Détermine quel composant d'étape doit être affiché
    currentStepComponent() {
      if (this.currentStep === 1) return 'StepOne';
      if (this.currentStep === 2) return 'StepTwo';
      return null;
    }
  },
  methods: {
    /**
     * Gère la complétion de l'étape 1 et stocke le pseudo.
     * @param {string} pseudo - Le pseudo saisi par l'utilisateur.
     * @returns {void} - Ne retourne rien.
     */
    handleStep1Completed(pseudo) {
      this.pseudo = pseudo; // Stocke le pseudo
      this.currentStep = 2; // Passe à l'étape 2
    },

    /**
     * Gère la complétion de l'étape 2 en envoyant les données au backend.
     * @param {Object} grid - Un objet contenant les numéros principaux et étoiles sélectionnés.
     * @param {Array} grid.main - Les numéros principaux sélectionnés.
     * @param {Array} grid.star - Les numéros étoiles sélectionnés.
     * @returns {Promise<void>} - Retourne une promesse qui résout lors de la complétion de la requête.
     */
    async handleStep2Completed(grid) {
      this.main = grid.main; // Stocke les numéros principaux
      this.star = grid.star; // Stocke les numéros étoiles

      try {
        const response = await axios.post('http://localhost:5001/api/users', {
          pseudo: this.pseudo, // Envoie le pseudo
          grille: this.main,    // Envoie la grille principale
          etoile: this.star,    // Envoie la grille étoile
        });
        console.log(response.data); // Affiche les données retournées par le serveur
        this.isSuccess = true; // Indique que l'utilisateur a été créé avec succès

        // Redirige vers la page des joueurs après 2 secondes
        setTimeout(() => {
          this.$router.push('/players');
        }, 2000);

      } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error.response ? error.response.data : error.message);
        // Affiche un message d'erreur si la requête échoue
        alert(error.response && error.response.data && error.response.data.message ? error.response.data.message : 'Erreur lors de la création de l\'utilisateur.');
      }
    }
  }
};
</script>

<style scoped>

</style>
