<template>
  <div class="success">
    <h2>Succès</h2>
    <p>L'utilisateur <strong>{{ pseudo }}</strong> a été créé avec succès !</p>
  </div>
</template>

<script>
export default {
  name: 'SuccessPage',
  props: {
    pseudo: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped>
.success {
  text-align: center;
  margin-top: 50px;
}
</style>
