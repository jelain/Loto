<template>
  <div id="app" class="main-container">
    <HeaderNav/>
    <router-view />
  </div>
</template>

<script>
import HeaderNav from "@/components/HeaderNav.vue";

export default {
  name: 'App' ,
  components: {HeaderNav} //Test GIT
};
</script>

<style>
body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  margin: 0;
  padding: 0;
  color: #2D4044;
}
</style>
