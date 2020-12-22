<template>
  <div class="">
    <b-navbar toggleable="lg" type="dark" variant="dark" position: fixed="top">
      <b-navbar-brand href="#">Jacob Williams</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <!-- <b-nav-item right href="/#portfolio">Link</b-nav-item>
          <b-nav-item right href="#" disabled>Disabled</b-nav-item> -->
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<style scoped>
.fix-top {
  margin-top: -63px;
}
</style>
