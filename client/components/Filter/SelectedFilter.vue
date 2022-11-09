<template>
  <dropdown-menu
    v-model="show"
    :interactive="true"
  >
    <div class="filter" :class="{active: filterObj.value !== null}">
      <strong>{{ filterObj.type }}</strong>: {{ filterVal }}
    </div>
    <div slot="dropdown" class="filter-options">
      <div v-if="filterObj.type === 'reaction'">
        <h4>Predominant reaction:</h4>
        <button
          v-for="reactType in reactionTypes"
          class="toggle-btn reacts"
          :class="{selected: filterObj.value === reactType}"
          @click="setValue(reactType)"
        >
          {{ emoji(reactType)}}
        </button>
      </div>
      <input
        v-else
        :value="filterObj.value"
        @change="setValue($event.target.value)"
      />
      <button
        class="text-btn delete-filter"
        @click="$store.commit('deleteFilter', index)"
      >
      🗑️</button>
    </div>
  </dropdown-menu>
</template>
<script>
import DropdownMenu from '@innologica/vue-dropdown-menu';

export default {
  name: 'SelectedFilter',
  components: {DropdownMenu},
  props: {
    filterObj: {
      type: Object,
      required: true,
    },
    index: Number,
  },
  data() {
    return {
      show: false,
      reactionTypes: [
        'LOVE',
        'HAHA',
        'SAD',
        'ANGRY',
        'LIKE',
        'DISLIKE',
      ],
    }
  },
  computed: {
    filterVal() {
      if (this.filterObj.value === null) {
        return '';
      }
      if (this.filterObj.type === 'reaction') {
        return this.emoji(this.filterObj.value);
      }
      return this.filterObj.value;
    },
  },
  methods: {
    emoji(reactType) {
      switch(reactType) {
        case 'LOVE':
          return '♥️';
        case 'HAHA':
          return '😂';
        case 'SAD':
          return '😢';
        case 'ANGRY':
          return '😡';
        case 'LIKE':
          return '👍';
        case 'DISLIKE':
          return '👎';
        default:
          return '';
      }
    },
    setValue(value) {
      if (value === '') {
        value = null;
      }
      this.$store.commit('updateFilters', {index: this.index, value});
      this.show = false;
    }
  },
}
</script>

<style>
.filter ~ .dropdown-menu > div {
  display: flex;
}
.filter {
  padding: 4px 8px;
  border: 1px solid #474747;
  color: #474747;
  border-radius: 100px;
  cursor: pointer;
  margin-right: 4px;
}

.filter.active {
  color: #37239b;
  border-color: #37239b;
}

.filter ~ .dropdown-menu {
  padding: 12px;
}
.delete-filter {
  margin-left: 8px;
}
.filter-options h4 {
  margin: 4px 0;
}
.filter-options .toggle-btn.reacts {
  margin: 0 4px 4px 0;
}
</style>
