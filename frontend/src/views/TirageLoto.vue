<template>
  <div id="tirage" class="container">
    <h1>Tirage</h1>
    <div class="grid-container">
      <div class="grid">
        <div v-for="index in 5" :key="index" class="number">
          <p>?</p>
        </div>
        <div v-for="index in 2" :key="index" class="number star">
          <p>?</p>
        </div>
      </div>
    </div>
    <div class="button-container">
      <button @click="startDraw" class="button">Lancer le tirage</button>
    </div>

    <!-- Confirmation Popup -->
    <ConfirmationPopup
        v-if="showConfirmation"
        @yes="handleYes"
        @no="handleNo"
    />

    <!-- Generate Players Popup (Après "Oui" à Confirmation) -->
    <GeneratePlayersPopup
        v-if="showGeneratePlayers"
        @generate="handleGenerate"
    />

    <!-- User Count Popup (Après "Non" à Confirmation) -->
    <UserCountPopup
        v-if="showUserCount"
        :userCount="userCount"
        @yes="handleUserCountYes"
        @no="handleUserCountNo"
    />

    <!-- Generate Players Popup (Après "Oui" à UserCount) -->
    <GeneratePlayersPopup
        v-if="showGeneratePlayersFromUserCount"
        @generate="handleGenerateFromUserCount"
    />
  </div>
</template>

<script>
import ConfirmationPopup from '../components/ConfirmationPopup.vue';
import UserCountPopup from '../components/UserCountPopup.vue';
import GeneratePlayersPopup from '../components/GeneratePlayersPopup.vue';
import axios from 'axios'; // Importer Axios pour les requêtes HTTP
import { useRouter } from 'vue-router';
import { mapGetters } from 'vuex';

export default {
  name: 'App', // Nom du composant
  components: {
    ConfirmationPopup,
    UserCountPopup,
    GeneratePlayersPopup
  },
  data() {
    return {
      showConfirmation: false, // État pour afficher la popup de confirmation
      showGeneratePlayers: false, // État pour afficher la popup de génération de joueurs
      showUserCount: false, // État pour afficher la popup de comptage d'utilisateurs
      showGeneratePlayersFromUserCount: false, // État pour afficher la popup de génération de joueurs après le comptage
      userCount: 0, // Nombre initial de joueurs
      grid: [] // État pour la grille générée
    };
  },
  computed: {
    ...mapGetters('selectedPlayers', ['selectedPlayers']), // Récupérer les joueurs sélectionnés depuis Vuex
  },
  mounted() {
    this.countPlayers(); // Compter les joueurs à la monté du composant
  },
  setup() {
    const router = useRouter(); // Configuration du router pour la navigation
    return { router };
  },
  methods: {
    /**
     * Démarre le tirage en affichant la popup de confirmation.
     * @returns {void}
     */
    startDraw() {
      this.showConfirmation = true; // Affiche la popup de confirmation
    },

    /**
     * Gère la réponse "Oui" à la popup de confirmation.
     * @returns {void}
     */
    handleYes() {
      this.showConfirmation = false; // Ferme la popup de confirmation
      this.showGeneratePlayers = true; // Affiche la popup de génération de joueurs
    },

    /**
     * Gère la réponse "Non" à la popup de confirmation.
     * @returns {void}
     */
    handleNo() {
      this.showConfirmation = false; // Ferme la popup de confirmation
      this.showUserCount = true; // Affiche la popup de comptage d'utilisateurs
    },

    /**
     * Gère la génération des joueurs après confirmation.
     * @param {number} number - Le nombre de joueurs à générer.
     * @returns {Promise<void>}
     */
    async handleGenerate(number) {
      this.showGeneratePlayers = false; // Ferme la popup de génération de joueurs
      await this.deleteGeneratedPlayers(); // Supprime les joueurs générés précédemment
      await this.generatePlayers(number); // Génère les joueurs
      this.generateGrid(); // Génère la grille
      this.performDrawBot(); // Effectue le tirage avec les bots
    },

    /**
     * Gère la réponse "Oui" pour afficher la génération de joueurs à partir du comptage d'utilisateurs.
     * @returns {void}
     */
    handleUserCountYes() {
      this.showUserCount = false; // Ferme la popup de comptage d'utilisateurs
      this.showGeneratePlayersFromUserCount = true; // Affiche la popup de génération de joueurs à partir du comptage
    },

    /**
     * Gère la réponse "Non" pour le comptage d'utilisateurs et effectue le tirage.
     * @returns {Promise<void>}
     */
    async handleUserCountNo() {
      this.showUserCount = false; // Ferme la popup de comptage d'utilisateurs
      await this.deleteGeneratedPlayers(); // Supprime les joueurs générés précédemment
      this.performDrawPlayer(); // Effectue le tirage avec les joueurs
    },

    /**
     * Gère la génération des joueurs après avoir reçu le comptage d'utilisateurs.
     * @param {number} number - Le nombre de joueurs à générer.
     * @returns {Promise<void>}
     */
    async handleGenerateFromUserCount(number) {
      this.showGeneratePlayersFromUserCount = false; // Ferme la popup de génération de joueurs
      await this.deleteGeneratedPlayers(); // Supprime les joueurs générés précédemment
      await this.generatePlayers(number); // Génère les joueurs
      this.generateGrid(); // Génère la grille
      this.performDrawPlayerBot(); // Effectue le tirage avec les joueurs et les bots
    },

    /**
     * Compte le nombre de joueurs via l'API.
     * @returns {Promise<void>}
     */
    async countPlayers() {
      const response = await axios.get('http://localhost:5001/api/users/players'); // Récupère les joueurs depuis l'API
      this.userCount = response.data.length; // Met à jour le compte des joueurs
    },

    /**
     * Supprime les joueurs générés précédemment via l'API.
     * @returns {Promise<void>}
     */
    async deleteGeneratedPlayers() {
      try {
        const response = await axios.delete('http://localhost:5001/api/users/delete/generer'); // Supprime les joueurs générés
        console.log('Joueurs générés précédemment supprimés:', response.data);
      } catch (error) {
        console.error('Erreur lors de la suppression des joueurs générés :', error);
      }
    },

    /**
     * Génère un certain nombre de joueurs via l'API.
     * @param {number} number - Le nombre de joueurs à générer.
     * @returns {Promise<void>}
     */
    async generatePlayers(number) {
      try {
        const response = await axios.post('http://localhost:5001/api/users/generer', { nombre: number }); // Appelle l'API pour générer des joueurs
        console.log(`Génération de ${number} joueurs. Nombre total de joueurs : ${this.userCount}`);
        console.log('Joueurs générés : ', response.data.joueurs);
      } catch (error) {
        console.error('Erreur lors de la génération des joueurs :', error);
        // Gérer l'erreur si nécessaire, par exemple en affichant un message à l'utilisateur
      }
    },

    /**
     * Génère une grille de tirage avec des nombres aléatoires.
     * @returns {void}
     */
    generateGrid() {
      // Fonction pour générer des nombres uniques aléatoires dans une plage
      function generateUniqueNumbers(count, min, max) {
        const numbers = new Set();
        while (numbers.size < count) {
          const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min; // Génération d'un nombre aléatoire
          numbers.add(randomNumber);
        }
        return Array.from(numbers); // Retourner le tableau des nombres uniques
      }

      // Générer 5 nombres "main" uniques entre 1 et 49
      const mainNumbers = generateUniqueNumbers(5, 1, 49);

      // Générer 2 nombres "star" uniques entre 1 et 9
      const starNumbers = generateUniqueNumbers(2, 1, 9);

      // Sauvegarder la grille comme un objet contenant "main" et "stars"
      this.grid = {
        main: mainNumbers,
        stars: starNumbers
      };

      // Sauvegarder la grille dans le localStorage
      localStorage.setItem('generatedGrid', JSON.stringify(this.grid));
      console.log('Grille générée et sauvegardée : ', this.grid);
    },

    /**
     * Effectue le tirage avec les joueurs bots.
     * @returns {void}
     */
    performDrawBot() {
      // Simuler le tirage
      console.log('Tirage effectué avec les joueurs disponibles.');

      // Naviguer vers la page de tirage et afficher la grille générée
      this.router.push({ name: 'TirageClassementBot' });
    },

    /**
     * Effectue le tirage avec les joueurs.
     * @returns {void}
     */
    performDrawPlayer() {
      // Simuler le tirage
      console.log('Tirage effectué avec les joueurs disponibles.');

      // Naviguer vers la page de tirage et afficher la grille générée
      this.router.push({ name: 'TirageClassementPlayer' });
    },

    /**
     * Effectue le tirage avec les joueurs et les bots.
     * @returns {void}
     */
    performDrawPlayerBot() {
      // Simuler le tirage
      console.log('Tirage effectué avec les joueurs disponibles.');

      // Naviguer vers la page de tirage et afficher la grille générée
      this.router.push({ name: 'TirageClassementPlayerBot' });
    }
  }
};
</script>

<style scoped>
.button {
  width: 8rem;
  color: #2d4044;
}

.button:hover {
  background-color: #2d4044;
  color: #FFFFFF;
}

.grid-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 15rem;
}

.number {
  width: 5rem;
  height: 5rem;
  font-size: 2rem;
}

.number.star {
  border: 1.3px solid #CDA462; /* Style spécifique pour les étoiles */
}

.button-container {
  display: flex;
  justify-content: center; /* Centre le bouton dans le conteneur */
}
</style>
