<template>
  <div class="not-found">
    <h1>404 - Page Non Trouvée</h1>
    <router-link to="/">Retour à la page d'accueil</router-link>
  </div>
</template>

<script>
export default {
  name: 'NotFoundPage'
};
</script>

<style scoped>
.not-found {
  text-align: center;
  margin-top: 50px;
}
</style>
