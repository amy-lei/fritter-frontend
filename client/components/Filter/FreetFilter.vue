<template>
  <dropdown-menu
    v-model="show"
  >
    <button class="text-btn">
        + Add Filter
    </button>
    <div slot="dropdown">
        <button
          class="dropdown-item"
          href="#"
          :disabled="disableAuthor"
          :class="{disabled: disableAuthor}"
          @click="addFilter('author')"
        >@ Author</button>
        <button
          class="dropdown-item"
          href="#"
          @click="addFilter('tag')"
        ># Tag</button>
        <button
          class="dropdown-item"
          href="#"
          :disabled="disableReaction"
          :class="{disabled: disableReaction}"
          @click="addFilter('reaction')"
        >Reaction</button>
    </div>
  </dropdown-menu>
</template>
<script>

import DropdownMenu from '@innologica/vue-dropdown-menu';
import ExpandIcon from '@/components/common/ExpandIcon.vue';

export default {
  name: 'FreetFilter',
  components: {DropdownMenu, ExpandIcon},
  data() {
    return {
      show: false,
    }
  },
  computed: {
    disableAuthor() {
      return this.$store.state.filters.some(f => f.type === 'author');
    },
    disableReaction() {
      return this.$store.state.filters.some(f => f.type === 'reaction');
    },
  },
  methods: {
    addFilter(type_) {
      this.$store.commit('addFilters', type_);
      this.show = false;
    },
  },
}
</script>


<style>
/* @import "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"; */
.dropdown {
  position: relative;
} 
.dropdown-menu.show {
  display: block;
}
.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  display: none;
  float: left;
  min-width: 10rem;
  padding: 0.5rem 0;
  margin: 0.125rem 0 0;
  font-size: 1rem;
  color: #212529;
  text-align: left;
  list-style: none;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #555555;
  border-radius: 0.25rem;
} 
.dropdown-item {
  display: block;
  width: 100%;
  padding: 0.25rem 1.5rem;
  clear: both;
  font-weight: 400;
  color: #212529;
  text-align: inherit;
  white-space: nowrap;
  background-color: transparent;
  border: 0;
  text-decoration: none;
}
.dropdown-item:not(:disabled):hover {
  background-color: rgba(0,0,0, 0.025);
}
.dropdown-item:disabled {
  opacity: 75%;
}
</style>
