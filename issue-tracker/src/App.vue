<template>
  <div id="app">
    <Navigation />
    <router-view />
    <Footer />
  </div>
</template>

<script>
import axios from 'axios';
import Navigation from "@/components/Navigation.vue";
import Footer from "@/components/Footer.vue";
export default {
  name: "App",
  components: {
    Navigation,
    Footer,
  },
  async created() {
    await this.getMeta();
  },
  methods: {
    async getMeta() {
      try {
        let response = await axios.get("/api/meta/");
        this.$root.$data.modOptions = response.data.modOptions;
        this.$root.$data.forgeVersions = response.data.forgeVersions;
      } catch (error) {
        console.log(error);
      }
    }
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
