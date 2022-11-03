<template>
  <article>
    <div
      v-if="username in $store.state.blockedUsers"
      class="panel"
      @click="showContent = !showContent"
    >
      Content posted by a blocked user
			<span
				class='icon'
				:class='{ "active": showContent }'
			></span>
    </div>
    <collapse-transition mode="out-in">
      <div
        v-show="!(username in $store.state.blockedUsers) || showContent"
        class="wrapper"
      >
        <slot></slot>
      </div>
    </collapse-transition>
  </article>
</template>

<script>
import { CollapseTransition } from "@ivanv/vue-collapse-transition"

export default {
  name: 'BlockPanel',
  components: {CollapseTransition},
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
}
</script>

<style scoped>
.panel {
  border: 1px solid #111;
  font-style: italic;
  padding: 20px;
  position: relative;
}
.v-enter-active, .v-leave-active {
  transition: all 1s ease-in-out;
  overflow: hidden;
  max-height: 100vh;
}
.v-enter-from, .v-leave-to {
  max-height: 0;
}

.icon {
	position: relative;
	margin: 0;
	margin-left: 8px;
	padding: 0;
	width: 1em;
	height: 1em;
	box-sizing: border-box;
}
.icon:after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: .4em;
  height: .4em;
  border-width: 1.5px 1.5px 0 0;
  border-style: solid;
  border-color: initial;
  transform: rotate(45deg) translate(0, -50%);
  transform-origin: top;
  transition: transform .3s ease-out;
  box-sizing: border-box;
}

.icon.active:after {
  transform: rotate(135deg) translate(0, -50%);
}

</style>