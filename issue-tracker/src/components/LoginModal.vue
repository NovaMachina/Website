<template>
  <div>
    <b-form @submit.prevent="login">
      <b-form-group
        id="username-group"
        label="Username"
        label-for="username-input"
      >
        <b-form-input
          id="username-input"
          required
          v-model="username"
          placeholder="Username"
        />
      </b-form-group>
      <b-form-group
        id="password-group"
        label="Password"
        label-for="password-input"
      >
        <b-form-input
          id="password-input"
          required
          v-model="password"
          placeholder="Password"
        />
      </b-form-group>
      <div class="buttons">
        <b-button-group>
          <b-button type="submit" variant="success">Log In</b-button>
          <b-button @click="close()" variant="danger">Cancel</b-button>
        </b-button-group>
      </div>
    </b-form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "LoginModal",
  data() {
    return {
      username: "",
      password: "",
      error: "",
    };
  },
  methods: {
    close() {
      this.$nextTick(() => {
        this.$bvModal.hide("login-modal");
      });
    },
    async login() {
      this.error = "";
      try {
        let response = await axios.post("/api/users/login", {
          username: this.username,
          password: this.password,
        });
        this.$root.$data.user = response.data.user;
        this.close();
      } catch (error) {
        this.error = error.response.data.message;
        this.$root.$data.user = null;
      }
    },
  },
};
</script>

<style scoped>
.buttons {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.error {
  margin-top: 20px;
  display: inline;
  padding: 5px 20px;
  border-radius: 30px;
  font-size: 10px;
  background-color: #d9534f;
  color: #fff;
}
</style>
