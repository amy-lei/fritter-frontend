<template>
  <div id="app">
    <header>
      <NavBar />
    </header>
    <router-view />
  </div>
</template>

<script>
import NavBar from '@/components/common/NavBar.vue';

export default {
  name: 'App',
  components: {NavBar},
  beforeCreate() {
    // Sync stored username to current session
    fetch('/api/users/session', {
      credentials: 'same-origin' // Sends express-session credentials with request
    }).then(res => res.json()).then(res => {
      const user = res.user;
      this.$store.commit('setUsername', user ? user.username : null);
      if (user) {
        this.$store.commit('refreshBlocks');
      } else {
        this.$store.commit('clearBlocks');
      }
    });

    // Clear alerts on page refresh
    this.$store.state.alerts = {};
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap');

* {
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
}

body {
  height: 100vh;
  flex-direction: column;
  display: flex;
  padding: 0;
  margin: 0;
  font-size: 16px;
}

main {
  max-width: 600px;
  margin: auto;
}

.alerts {
    position: absolute;
    z-index: 99;
    bottom: 0;
    top: 100%;
    left: 50%;
    transform: translate(-50%, 10%);
    width: 100%;
    text-align: center;
}

.alerts article {
    border-radius: 5px;
    padding: 10px 20px;
    color: #fff;
}

.alerts p {
    margin: 0;
}

.alerts .error {
    background-color: rgb(166, 23, 33);
}

.alerts .success {
    background-color: rgb(45, 135, 87);
}

button {
  border: none;
  border: 1px solid transparent;
  font-family: inherit;
  padding: 8px 20px;
  border-radius: 100px;
  font-size: 16px;
  transition: all 0.1s ease-in-out;
  cursor: pointer;
}

button.disabled {
  cursor: default;
}

button:not(.disabled):hover {
  filter: brightness(90%);
}

.toggle-btn {
  background-color: #ececec;
  padding: 4px 8px;
}

.toggle-btn.selected {
  background-color: #cdcdcd;
}

.primary-btn {
  background-color: #6c79d4;
  color: white;
  width: fit-content;
}

.text-btn {
  padding: 4px 0;
  background: none;
  border-radius: 0;
  transition: all 0.1s ease-in-out;
}
.text-btn:hover {
  background: none;
  opacity: 70%;
}

</style>
