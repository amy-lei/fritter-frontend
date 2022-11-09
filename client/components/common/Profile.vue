<template>
  <div class="profile">
    <div
      class="profile-image"
      :style="{'background': color}"
    >
      {{ letter }}
    </div>
    <h4 v-if="showName" class="profile-name">
      @{{ username }}
    </h4>
  </div>
</template>

<script>
import BlockModal from '@/components/Block/BlockModal.vue';
import LoginContent from '@/components/common/LoginContent.vue';

export default {
  name: 'ProfileComponent',
  mixins: [LoginContent],
  components: {BlockModal},
  props: {
    username: {
      type: String,
      required: true,
    },
    showName: Boolean,
    showBlock: Boolean,
  },
  data() {
    return {
      showBlockModal: false,
    }
  },
  computed: {
    letter() {
        return this.username?.toUpperCase()?.charAt(0) || ' ';
    },
    color() {
      // Source for string to hex color code snippet:
      // https://stackoverflow.com/a/16348977
      let hash = 0;
      const username = this.username || '';
      for (let i = 0; i < username.length; i++) {
          hash = username.charCodeAt(i) + ((hash << 5) - hash);
      }
      let color = '#';
      for (let i = 0; i < 3; i++) {
          let value = (hash >> (i * 8)) & 0xFF;
          color += ('00' + value.toString(16)).substr(-2);
      }
      return color;
    },
  },
  methods: {
    hideBlockModal() {
      this.showBlockModal = false;
    },
  },
}
</script>
<style scoped>
.profile {
  display: flex;
  align-items: center;
}
.profile-image {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  font-size: 20px;
  color: #fff;
  text-align: center;
  line-height: 56px;
  margin-right: 8px;
}

.profile-name {
  flex-grow: 1;
}

.actions {
  align-self: start;
}
</style>