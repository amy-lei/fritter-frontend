<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <nav>
    <div class="left">
      <img src="../../public/logo.svg">
      <h1 class="title">
        Fritter
      </h1>
    </div>
    <div class="right">
      <router-link to="/" class="text-btn">
        Home
      </router-link>
      <router-link
        v-if="$store.state.username"
        class="edit-profile"
        to="/account"
      >
        <ProfileComponent
          class="edit-profile-btn"
          :username="$store.state.username"
        />
      </router-link>
      <router-link
        v-else
        class="text-btn"
        to="/login"
      >
        Login
      </router-link>
    </div>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in $store.state.alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </nav>
</template>

<script>
import ProfileComponent from '@/components/common/Profile.vue';
export default {
  name: 'NavBar',
  components: {ProfileComponent}
}
</script>


<style scoped>
nav {
    padding: 1vw 2vw;
    background-color: #ccd1f3;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
}

.title {
    font-size: 32px;
    margin: 0 5px;
}

img {
    height: 32px;
}

.left {
	display: flex;
	align-items: center;
}

.right {
  font-size: 16px;
  display: grid;
  gap: 16px;
  grid-auto-flow: column;
  align-items: center;
}

.right a ~ a {
  margin-left: 4px;
}
.right a {
  text-decoration: none;
}

.right .edit-profile {
  transform: scale(0.85);
}

.alerts {
  width: 25%;
}
</style>
