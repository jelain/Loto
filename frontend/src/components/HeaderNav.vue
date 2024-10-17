<template>
  <header>
    <img src="../assets/loto_logo.png" alt="Logo du Loto">
    <nav>
      <ul>
        <li>
          <router-link
              to="/players"
              :class="{ 'active-link': isActivePlayers }"
              exact
          >joueurs</router-link>
        </li>
        <li>
          <router-link
              to="/tirage"
              :class="{ 'active-link': isActiveTirage }"
          >tirage</router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

// Obtient l'objet de route actuel
const route = useRoute();

// Vérifie si l'URL actuelle est dans /players ou une de ses sous-routes
const isActivePlayers = computed(() => route.path.startsWith('/players')); // Renvoie true si le chemin commence par '/players'
const isActiveTirage = computed(() => route.path.startsWith('/tirage')); // Renvoie true si le chemin commence par '/tirage'
</script>

<style scoped>
header {
  background-color: #FFFFFF;
  height: 100vh; /* Remarque: Cela peut être modifié selon les besoins */
  width: 15em;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5em;
}

img {
  margin-top: 3em;
  width: 10em; /* Remarque: Ajustez la taille selon vos besoins */
  text-align: center;
}

nav {
  width: 70%;
}

nav ul {
  display: flex;
  flex-direction: column;
  gap: 2em;
  padding: 0; /* Assure qu'il n'y a pas de padding par défaut sur le ul */
}

nav li {
  list-style: none; /* Enlève les puces des éléments de liste */
}

a {
  text-decoration: none;
  color: #2D4044;
  font-size: 18px;
  text-transform: capitalize;
}

.active-link {
  color: #51BECC; /* Couleur pour le lien actif */
}
</style>
