<template>
  <div>
    <b-form @submit="submitIssue">
      <b-form-group
        id="title-group"
        label="Title"
        label-for="title-input"
        description="A title for your issue."
      >
        <b-form-input
          id="title-input"
          required
          v-model="form.title"
          placeholder="Title"
        />
      </b-form-group>

      <b-form-group
        id="mod-group"
        label="Mod"
        label-for="mod-input"
        description="Which mod does your issue pertain to?"
      >
        <b-form-select
          id="mod-input"
          required
          v-model="form.selectedMod"
          :options="this.$root.$data.modOptions"
        >
        </b-form-select>
      </b-form-group>

      <b-form-group
        id="forge-group"
        label="Forge Version"
        label-for="forge-input"
        description="Which version of Forge does your issue pertain to?"
      >
        <b-form-select
          id="forge-input"
          required
          v-model="form.forgeVersion"
          :options="this.$root.$data.forgeVersions"
        >
        </b-form-select>
      </b-form-group>

      <b-form-group
        id="description-group"
        label="Description"
        label-for="description-input"
        description="Provide a thorough description of your issue."
      >
        <b-form-textarea
          id="description-input"
          required
          v-model="form.description"
        />
      </b-form-group>
      <b-form-group
        id="image-group"
        label="Images"
        label-for="image-input"
        description="Provide any images that might be helpful."
      >
        <div class="files" v-for="image in form.addedImages" :key="image.id">
          <p>{{ image.name }}</p>
          <b-button @click="removeImage(image)" variant="link">Remove</b-button>
        </div>
        <div class="imageSelection">
          <b-form-file
            id="image-input"
            v-model="selectedImages"
            accept="image/jpeg, image/png, image/gif"
            multiple
          />
          <b-button @click="addImages">Add Images</b-button>
        </div>
      </b-form-group>
      <b-form-group
        id="files-group"
        label="Files"
        label-for="files-input"
        description="Provide any log file links that might be helpful. Logs must be submitted through gist.github.com or pastebin.com"
      >
        <div class="files" v-for="file in form.addedFiles" :key="file.id">
          <b-link :href="file">{{ file }}</b-link>
          <b-button @click="removeFile(file)" variant="link">Remove</b-button>
        </div>
        <div class="imageSelection">
          <b-form-input id="files-input" v-model="fileToAdd" type="url" />
          <b-button @click="addFile">Add File</b-button>
        </div>
      </b-form-group>
      <div class="buttons">
        <b-button-group>
          <b-button type="submit" variant="success">Submit</b-button>
          <b-button @click="close()" variant="danger">Cancel</b-button>
        </b-button-group>
      </div>
    </b-form>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "NewIssueModal",
  props: ["getIssuesParentFunction", "successToast", "failToast"],
  data() {
    return {
      form: {
        title: "",
        forgeVersion: null,
        selectedMod: null,
        description: "",
        addedImages: [],
        addedFiles: [],
      },
      selectedImages: [],
      fileToAdd: "",
    };
  },
  methods: {
    close() {
      this.$nextTick(() => {
        this.$bvModal.hide("new-issue-modal");
      });
    },
    addImages() {
      this.selectedImages.forEach((element) => {
        let alreadyAdded = false;
        this.form.addedImages.forEach((image) => {
          if (image.name === element.name) {
            alreadyAdded = true;
            alert(image.name + " has already been added.");
          }
        });
        if (!alreadyAdded) {
          this.form.addedImages.push(element);
        }
      });
      this.selectedImages = [];
    },
    removeImage(image) {
      this.form.addedImages.splice(this.form.addedImages.indexOf(image), 1);
    },
    addFile() {
      if (this.fileToAdd === "") {
        return;
      }
      let alreadyAdded = false;
      this.form.addedFiles.forEach((file) => {
        if (file === this.fileToAdd) {
          alreadyAdded = true;
          alert(this.fileToAdd + " has already been added.");
        }
      });
      if (!alreadyAdded) {
        this.form.addedFiles.push(this.fileToAdd);
      }
      this.fileToAdd = "";
    },
    removeFile(file) {
      this.form.addedFiles.splice(this.form.addedFiles.indexOf(file), 1);
    },
    async submitIssue(event) {
      event.preventDefault();
      try {
        for (let i = 0; i < this.form.addedImages.length; i++) {
          const formData = new FormData();
          formData.append(
            "photo",
            this.form.addedImages[i],
            this.form.addedImages[i].name
          );
          let response = await axios.post("/api/issues/images", formData);
          this.form.addedImages[i] = response.data.path;
        }
        await axios.post("/api/issues", {
          user: this.$root.$data.user,
          username: this.$root.$data.user.username,
          title: this.form.title,
          forgeVersion: this.form.forgeVersion,
          selectedMod: this.form.selectedMod,
          description: this.form.description,
          images: this.form.addedImages,
          files: this.form.addedFiles,
        });
        this.close();
        this.getIssuesParentFunction();
        this.successToast();
      } catch (error) {
        this.failToast();
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
.files {
  display: flex;
}

.buttons {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
</style>
