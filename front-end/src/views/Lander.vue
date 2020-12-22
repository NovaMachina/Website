<template>
  <div>
    <!-- lander section -->
    <b-container fluid class="section">
      <b-img
        v-bind="mainProps"
        alt="Profile Image"
        rounded="circle"
        src="@/assets/ProfileImage.jpg"
      />
      <h1>Software Developer</h1>
      <p>Provo, Utah</p>
      <b-button v-b-modal.contact-modal>Contact</b-button>
    </b-container>

    <b-container fluid id="about">
      <h1>About Me</h1>
      <b-container class="about-text">
        <b-row>
          <b-col>
            <p>
              I am currently an undergrad at Brigham Young University
              studying Computer Science with an emphasis in Software Engineering.
              I will be graduating in April 2021. I am a proficient Java developer
              with some experience in C, C++, and Python.
              I'm also an avid front-end developer, with experience in Vue.js, JavaScript, Node.js,
              and Android app development.
            </p>
            <p>
              I'm currently looking for an entry level Junior Developer position.
            </p>
            <p>
              In my freetime I enjoy playing board games, reading books, hanging out
              with friends, and working on some of my programming projects. I do enjoy
              the outdoors (camping and hiking), but unfortunately the outdoors do not
              like me (I've got some pretty bad seasonal allergies).
            </p>
          </b-col>
          <b-col>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
              <li>Item 3</li>
            </ul>
          </b-col>
        </b-row>
      </b-container>
    </b-container>

    <!-- portfolio section -->
    <b-container fluid id="protfolio">
      <h1>Portfolio</h1>
      <p>Some of the projects I've worked on</p>
      <b-container>
        <b-row>
          <b-col class="col-md-4">
            <b-card header-tag="header">
              <template #header>
                <b-img
                  v-bind="portfolioProps"
                  alt="Ex Nihilo Logo"
                  rounded="circle"
                  src="@/assets/ExNihiloLogo.png"
                />
                <h3>Ex Nihilo</h3>
              </template>
              <b-card-text>
                Ex Nihilo: Sequentia is a Minecraft Forge mod for versions 1.15
                and 1.16 of Minecraft. I plan to continue this mod and to create
                more addons for Ex Nihilo and other mods.
              </b-card-text>
              <b-button
                href="https://www.curseforge.com/minecraft/mc-mods/ex-nihilo-sequentia"
                >More</b-button
              >
            </b-card>
          </b-col>

          <b-col class="col-md-4">
            <b-card header-tag="header">
              <template #header>
                <b-img
                  v-bind="portfolioProps"
                  alt="Vue logo"
                  rounded="circle"
                  src="https://i.pinimg.com/originals/4a/70/56/4a70563234301578c158dc142384a1c3.png"
                />
                <h3>This Website</h3>
              </template>
              <b-card-text>
                This is the first website that I've ever created. I hope to turn
                this into an expression of who I am and what I am able to
                accomplish.
              </b-card-text>
            </b-card>
            <br />
          </b-col>

          <b-col class="col-md-4">
            <b-card header-tag="header">
              <template #header>
                <b-img
                  v-bind="portfolioProps"
                  alt="Vue logo"
                  rounded="circle"
                  src="@/assets/GitHub-Mark-120px-plus.png"
                />
                <h3>GitHub</h3>
              </template>
              <b-card-text>
                Pretty much all of my work can be found on GitHub. Besides Ex
                Nihilo: Sequentia, on there another big project is my program
                capstone project, a VSCode extension and language server for
                Bazel.
              </b-card-text>
              <b-button href="https://github.com/NovaMachina">More</b-button>
            </b-card>
          </b-col>
        </b-row>
      </b-container>
    </b-container>

    <!-- modal for contact -->

    <b-modal
      id="contact-modal"
      @ok="submitContact"
      @show="resetContact"
      @hidden="resetContact"
    >
      <b-container style="padding:10%">
        <h2>Contact Me</h2>
        <form
          action="mailto:alloyking1@gmail.com"
          method="post"
          enctype="text/plain"
        >
          <div class="form-group">
            <input
              type="email"
              class="form-control"
              v-model="contact.email"
              placeholder="Enter email"
            />
          </div>
          <div class="form-group">
            <textarea
              class="form-control"
              v-model="contact.message"
              rows="3"
              placeholder="Message..."
            ></textarea>
          </div>
        </form>
      </b-container>
    </b-modal>
  </div>
</template>

<script lang="ts">
export default {
  name: "Lander",
  components: {},
  data() {
    return {
      mainProps: {
        blank: false,
        blankColor: "#777",
        width: 250,
        height: 250,
        class: "m1",
      },
      portfolioProps: {
        blank: false,
        blankColor: "#777",
        width: 150,
        height: 150,
        class: "m1",
      },
      contact: {
        email: "",
        message: "",
      },
    };
  },
  methods: {
    submitContact() {
      if (this.contact.email != "" && this.contact.message != "") {
        // send details to email
      } else {
        alert("All fields are required");
      }
    },
    resetContact() {
      this.contact.email = "";
      this.contact.message = "";
    },
  },
};
</script>

<style lang="css" scoped>
.section {
  padding-top: 10%;
  padding-bottom: 10%;
}
#about,
#protfolio {
  background-color: #34345238;
  padding-top: 8%;
  padding-bottom: 15%;
  /* padding:15% */
}
.about-text {
  text-align: left;
}
.img-custome {
  width: 140px;
  height: 140px;
  margin-top: 15px;
}
</style>
