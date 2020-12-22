<template>
  <div>
    <b-container class="section">
      <h1>Issues</h1>
      <div class="issue-header">
        <b-form-select
          v-model="selected"
          :options="this.$root.$data.modOptions"
          class="mod-selector"
        >
          <template #first>
            <b-form-select-option value="all">--All--</b-form-select-option>
          </template>
        </b-form-select>
        <div class="menu">
          <div v-if="this.$root.$data.user != null">
            <b-button-group>
              <b-button @click="$bvModal.show('new-issue-modal')"
                >New Issue</b-button
              >
            </b-button-group>
          </div>
        </div>
      </div>

      <div v-for="issue in this.issues" :key="issue.id">
        <Issue :issue="issue" />
        <br />
      </div>
      <b-pagination-nav
        :link-gen="linkGen"
        :number-of-pages="this.issuePages"
        use-router
      ></b-pagination-nav>
    </b-container>

    

    <b-modal id="new-issue-modal" title="New Issue" hide-footer size="xl">
      <NewIssueModal
        :getIssuesParentFunction="getIssues"
        :successToast="showSuccessToast"
        :failToast="showFailToast"
      />
    </b-modal>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import Issue from "@/components/Issue";
import NewIssueModal from "@/components/NewIssueModal";
export default {
  name: "Lander",
  components: {
    Issue,
    NewIssueModal
  },
  data() {
    return {
      selected: "all",
      issues: [],
      issuePages: null,
    };
  },
  watch: {
    selected() {
      this.getIssues();
    },
    page() {
      this.getIssues();
    },
  },
  computed: {
    page() {
      return this.$route.query.page;
    },
  },
  async created() {
    await this.getIssues();
  },
  methods: {
    async getIssues() {
      try {
        let response = await axios.get("/api/issues", {
          params: {
            page: this.page != undefined ? this.page : 1,
            mod: this.selected,
          },
        });
        this.issuePages = response.data.issuePages;
        this.issues = response.data.issues.filter((issue) => {
          if (this.selected === "all") {
            return true;
          }
          return issue.selectedMod === this.selected;
        });
      } catch (error) {
        console.log(error);
      }
    },
    linkGen(pageNum) {
      let query = pageNum === 1 ? "?" : `?page=${pageNum}`;
      return { path: `/main${query}` };
    },
    showSuccessToast() {
      this.$bvToast.toast(
        "Your issue was successfully submitted. We are now working on it.",
        {
          title: "Issue Successfuly Postsed",
          autoHideDelay: 5000,
          variant: "success",
          appendToast: false,
        }
      );
    },
    showFailToast() {
      this.$bvToast.toast(
        "There was an issue submitting your issue. Please try again later.",
        {
          title: "Failed to Submit Issue",
          autoHideDelay: 5000,
          variant: "danger",
          appendToast: false,
        }
      );
    },
  },
};
</script>

<style lang="css" scoped>
.user-control {
  display: flex;
  flex-direction: column;
}

.issue-header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 2%;
}

.cancelButton {
  display: flex;
  justify-content: flex-end;
}

.mod-selector {
  width: 50%;
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
