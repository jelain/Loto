<template>
  <div class="overlay">
    <div class="popup">
      <h2>plus de joueurs ?</h2>
      <p v-if="selectedPlayers.length > 0">
        Vous avez sélectionné {{ selectedPlayers.length }} joueurs.
        <br>Voulez-vous générer d’autre joueur ?
      </p>
      <p v-else>
        Il y a {{ userCount }} joueurs actuellement.
        <br>Voulez-vous générer d’autre joueur ?
      </p>
      <div class="button-container">
        <button @click="onYes" class="button yes">Oui</button>
        <button @click="onNo" class="button no">Non</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: 'UserCountPopup',
  props: {
    userCount: {
      type: Number,
      required: true
    }
  },
  emits: ['yes', 'no'],
  computed: {
    ...mapGetters('selectedPlayers', ['selectedPlayers']),
  },
  methods: {
    // Émet l'événement 'yes' lorsque l'utilisateur souhaite générer d'autres joueurs
    onYes() {
      this.$emit('yes');
    },
    // Émet l'événement 'no' lorsque l'utilisateur ne souhaite pas générer d'autres joueurs
    onNo() {
      this.$emit('no');
    }
  }
};
</script>

<style scoped>
</style>
