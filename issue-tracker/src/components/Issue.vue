<template>
  <div class="issue">
    <b-card header-tag="header" footer-tag="footer">
      <template #header>
        <div class="header">
          <b-button variant="link" @click="openIssue(issue.urlSlug)">
            <h3>{{ issue.title }}  <b-badge variant="success" v-if="issue.resolved">Resolved</b-badge></h3>
          </b-button>
          <div class="meta">
            <p>{{ issue.username }}</p>
            <p>{{ formatTime(issue.created) }}</p>
          </div>
        </div>
      </template>
      <b-card-text>{{ issue.description }}</b-card-text>
      <template #footer>
        <div class="footer">
          <p>{{issue.selectedMod}}</p>
          <p>Responses: {{ issue.responses.length }}</p>
        </div>
      </template>
    </b-card>
  </div>
</template>

<script>
import dayjs from 'dayjs';
export default {
  name: "Issue",
  props: ["issue"],
  methods: {
    formatTime(time) {
      return dayjs(time).format('YYYY-MM-DD hh:mm A');
    },
    openIssue(urlSlug) {
      this.$router.push({name: 'IssuePage', params: { slug: urlSlug}});
    }
  }
};
</script>

<style scoped>
h3,
p {
  margin: 0;
}
.issue {
  text-align: left;
}
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
