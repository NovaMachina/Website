<template>
  <div>
    <b-container
      class="section"
      v-if="
        this.$root.$data.user == null || this.$root.$data.user.role != 'admin'
      "
    >
      <h1>You do not have access to this page.</h1>
    </b-container>
    <b-container class="section" v-else>
      <h1>Admin</h1>
      <b-form-group label="Mods" v-slot="{ ariaDescribedby }">
        <b-form-checkbox-group
          v-model="selected"
          :options="options"
          :aria-describedby="ariaDescribedby"
          name="flavour-2a"
          stacked
        ></b-form-checkbox-group>
        <b-button
          variant="danger"
          v-if="selected.length > 0"
          @click="$bvModal.show('confirm-mod-delete-modal')"
          >Delete Selected</b-button
        >
        <div class="add-mod">
          <b-form-input v-model="modToAdd" placeholder="Add a mod..." />
          <b-button @click="addMod" variant="primary">Add</b-button>
        </div>
      </b-form-group>
    </b-container>
    <b-modal
      id="confirm-mod-delete-modal"
      title="Are you sure that you want to delete these mods?"
      hide-footer
    >
      <p>This cannot be undone.</p>
      <ul>
        <li v-for="item in selected" :key="item.id">{{ item }}</li>
      </ul>
      <b-button-group>
        <b-button @click="deleteMods" variant="warning">Confirm</b-button>
        <b-button @click="close('confirm-mod-delete-modal')" variant="success"
          >Cancel</b-button
        >
      </b-button-group>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      selected: [],
      modToAdd: "",
    };
  },
  computed: {
    options() {
      return this.$root.$data.modOptions;
    },
  },
  methods: {
    close(modal) {
      this.$nextTick(() => {
        this.$bvModal.hide(modal);
      });
    },
    async deleteMods() {
      try {
        this.selected.forEach(async (mod) => {
          await axios.delete("/api/meta/mod", {
            modToDelete: mod,
          });
        });
        this.close("confirm-mod-delete-modal");
        this.selected = [];
        await this.getMeta();
      } catch (error) {
        console.log(error);
      }
    },
    async getMeta() {
      try {
        let response = await axios.get("/api/meta/");
        this.$root.$data.modOptions = response.data.modOptions;
        this.$root.$data.forgeVersions = response.data.forgeVersions;
      } catch (error) {
        console.log(error);
      }
    },
    async addMod() {
      try {
        await axios.put("/api/meta/mod", {
          mod: this.modToAdd,
        });
        this.modToAdd = "";
        await this.getMeta();
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style scoped>
p {
  margin: 0;
}

.add-mod {
  display: flex;
}

@media only screen and (min-width: 961px) {
  .section {
    padding-top: 5%;
    padding-bottom: 10%;
    text-align: left;
  }
}

@media only screen and (min-width: 461px) and (max-width: 960px) {
  .section {
    padding-top: 8%;
    padding-bottom: 10%;
    text-align: left;
  }
}

@media only screen and (max-width: 460px) {
  .section {
    padding-top: 15%;
    padding-bottom: 10%;
    text-align: left;
  }
}
</style>
