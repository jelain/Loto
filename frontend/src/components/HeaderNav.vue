<template>
  <header>
    <img src="../assets/loto_logo.png" alt="">
    <nav>
      <ul>
        <li>
          <router-link
              to="/players"
              :class="{ 'active-link': isActive }"
              exact
          >joueurs</router-link>
        </li>
        <li>
          <router-link to="/tirage" :class="{ 'active-link': $route.path === '/tirage' }">tirage</router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

// Vérifie si l'URL actuelle est dans /players ou une de ses sous-routes
const route = useRoute();
const isActive = computed(() => {
  return route.path.startsWith('/players');
});
</script>

<style scoped>
header {
  background-color: #FFFFFF;
  height: 100vh;
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
  width: 10em;
  text-align: center;
}

nav {
  width: 70%;
}

nav ul {
  display: flex;
  flex-direction: column;
  gap: 2em;
}

nav li, a, ul {
  list-style: none;
  text-decoration: none;
  color: #2D4044;
  padding: 0;
  font-size: 18px;
  text-transform: capitalize;
}

.active-link {
  color: #51BECC;
}
</style>