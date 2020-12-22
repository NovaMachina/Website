<template>
  <b-card header-tag="header">
    <template #header>
      <div>
        <p>{{ response.username }}</p>
        <p>{{ formatTime(response.created) }}</p>
      </div>
    </template>
    <b-card-text>
      {{ response.response }}
    </b-card-text>
  </b-card>
</template>

<script>
import dayjs from "dayjs";
export default {
  name: "Response",
  props: ["response"],
  methods: {
    formatTime(time) {
      return dayjs(time).format("YYYY-MM-DD hh:mm A");
    },
  },
};
</script>

<style scoped>
p {
  margin: 0;
}
</style>
