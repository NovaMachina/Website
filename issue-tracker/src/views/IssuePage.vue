<template>
  <b-container class="section">
    <b-card header-tag="header" footer-tag="footer">
      <template #header>
        <div class="header">
          <h3>
            {{ issue.title }}
            <b-badge variant="success" v-if="issue.resolved">Resolved</b-badge>
          </h3>
          <div>
            <p>Submitted by: {{ issue.username }}</p>
            <p>Submitted on: {{ formatTime(issue.created) }}</p>
          </div>
        </div>
      </template>
      <b-card-text>
        {{ issue.description }}
      </b-card-text>
      <template #footer>
        <div class="footer">
          <p>Mod: {{ issue.selectedMod }}</p>
          <p>Forge Version: {{ issue.forgeVersion }}</p>
        </div>
      </template>
      <h3 v-if="issue.images.length > 0">Images</h3>
      <div v-for="image in issue.images" :key="image.id">
        <b-img :src="image" />
      </div>
      <h3 v-if="issue.files.length > 0">Files</h3>
      <div v-for="file in issue.files" :key="file.id">
        <b-link :href="file">{{ file }}</b-link>
      </div>
    </b-card>
    <div v-for="response in issue.responses" :key="response.id">
      <br />
      <Response :response="response" />
    </div>
    <b-button-group v-if="this.$root.$data.user != null">
      <b-button
        @click="setAddResponse"
        variant="primary"
        >Add Response</b-button
      >
      <b-button
        @click="markResolved"
        variant="success"
        v-if="this.$root.$data.user.role == 'admin' && !issue.resolved"
        >Mark Resolved</b-button
      >
      <b-button
        @click="markUnresolved"
        variant="danger"
        v-if="this.$root.$data.user.role == 'admin' && issue.resolved"
        >Mark Not Resolved</b-button
      >
    </b-button-group>
    <b-card v-if="addResponse">
      <b-form-group
        id="response-group"
        label="Response"
        label-for="response-input"
      >
        <b-form-textarea id="response-input" required v-model="response" />
      </b-form-group>
      <b-button-group>
        <b-button variant="danger" @click="setNoResponse">Cancel</b-button>
        <b-button variant="success" @click="submitResponse">Submit</b-button>
      </b-button-group>
    </b-card>
  </b-container>
</template>

<script>
import axios from "axios";
import dayjs from "dayjs";
import Response from "@/components/Response";
export default {
  name: "IssuePage",
  data() {
    return {
      issue: null,
      addResponse: false,
      response: "",
    };
  },
  components: {
    Response,
  },
  async created() {
    await this.getIssue(this.$route.params.slug);
  },
  methods: {
    async getIssue(slug) {
      try {
        let response = await axios.get("/api/issues/" + slug);
        this.issue = response.data.issue;
      } catch (error) {
        console.log(error);
      }
    },
    formatTime(time) {
      return dayjs(time).format("YYYY-MM-DD hh:mm A");
    },
    setAddResponse() {
      this.addResponse = true;
    },
    setNoResponse() {
      this.addResponse = false;
      this.response = "";
    },
    async submitResponse() {
      try {
        await axios.put("/api/issues/addResponse/" + this.issue._id, {
          response: this.response,
          username: this.$root.$data.user.username,
        });
        this.response = "";
        this.addResponse = false;
        this.getIssue(this.$route.params.slug);
      } catch (error) {
        console.log(error);
      }
    },
    async markResolved() {
      try {
        await axios.put("/api/issues/resolve/" + this.issue._id);
        this.getIssue(this.$route.params.slug);
      } catch (error) {
        console.log(error);
      }
    },
    async markUnresolved() {
      try {
        await axios.put("/api/issues/unresolve/" + this.issue._id);
        this.getIssue(this.$route.params.slug);
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

.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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
