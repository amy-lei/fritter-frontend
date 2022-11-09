<template>
  <article>
    <div
      v-if="showPanel"
      class="panel"
      @click="showContent = !showContent"
    >
      Content posted by a blocked user
      <ExpandIcon :active="showContent"/>
    </div>
    <collapse-transition mode="out-in">
      <div
        v-show="!(showPanel) || showContent"
        class="wrapper"
      >
        <slot></slot>
      </div>
    </collapse-transition>
  </article>
</template>

<script>
import { CollapseTransition } from "@ivanv/vue-collapse-transition";
import ExpandIcon from "@/components/common/ExpandIcon.vue";

export default {
  name: 'BlockPanel',
  components: {CollapseTransition, ExpandIcon},
  props: {
    username: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showContent: false,
    }
  },
  computed: {
    showPanel() {
      return this.username in this.$store.state.blockedUsers;
    }
  },
}
</script>

<style scoped>
.panel {
  font-style: italic;
  padding: 28px 20px;
  position: relative;
  cursor: pointer;
}
.v-enter-active, .v-leave-active {
  transition: all 1s ease-in-out;
  overflow: hidden;
  max-height: 100vh;
}
.v-enter-from, .v-leave-to {
  max-height: 0;
}

</style>