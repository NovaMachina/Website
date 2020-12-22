<template>
  <div class="">
    <b-navbar toggleable="lg" type="dark" variant="dark" position: fixed="top">
      <b-navbar-brand href="/main">Issue Tracker</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
         <b-navbar-nav class="ml-auto">
           <div v-if="this.$root.$data.user == null">
            <b-button-group>
              <b-button @click="$bvModal.show('login-modal')" variant="success"
                >Log In</b-button
              >
              <b-button
                @click="$bvModal.show('register-modal')"
                variant="primary"
                >Sign Up</b-button
              >
            </b-button-group>
          </div>
           <div v-if="this.$root.$data.user != null" class="signed-in-bar">
            <p class="userText">Logged In As: {{this.$root.$data.user.username}}</p>
            <b-button-group>
              <b-button @click="logout" variant="danger">Sign Out</b-button>
              <b-button to="/admin" variant="secondary">Admin</b-button>
            </b-button-group>
           </div>
         </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <b-modal id="login-modal" title="Log In" hide-footer>
      <LoginModal />
    </b-modal>
    
    <b-modal id="register-modal" title="Sign Up" hide-footer>
      <RegisterModal />
    </b-modal>
  </div>
</template>

<script>
import axios from 'axios';
import LoginModal from '@/components/LoginModal';
import RegisterModal from "@/components/RegisterModal";
export default {
  name: 'Navigation',
  components: {
    LoginModal,
    RegisterModal
  },
  async created() {
    try {
      let response = await axios.get("/api/users");
      this.$root.$data.user = response.data.user;
    } catch (error) {
      this.$root.$data.user = null;
    }
  },
  methods: {
    async logout() {
      try {
        await axios.delete("/api/users");
        this.$root.$data.user = null;
      } catch (error) {
        this.$root.$data.user = null;
      }
    },
  }
}
</script>

<style scoped>
.fix-top {
  margin-top: -63px;
}

.userText {
  color: #FFFFFF;
  padding-right: 5px;
  margin-bottom: 0;
}

.signed-in-bar {
  display: flex;
  align-items: baseline;
}
</style>
