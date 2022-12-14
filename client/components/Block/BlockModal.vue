<template>
  <div
    class="modal-backdrop"
    @click="hideModal"
  >
    <div
      v-if="username in $store.state.blockedUsers"
      class="modal-container"
      @click.stop=""
    >
      <h2>Unblock @{{ username }}</h2>
      <p>
        Content created by @{{ username }} will not longer be collapsed on default.
      </p>
      <div class="modal-actions">
        <button class="text-btn" @click="hideModal">Cancel</button>
        <button class="primary-btn" @click="unblock">Unblock</button>
      </div>
    </div>
    <div
      v-else
      class="modal-container"
      @click.stop=""
    >
      <div class="modal-header">
        <h2>Block @{{ username }}</h2>
        <p>
          Content created by blocked users will still be viewable, but collapsed on default.
        </p>
      </div>
      <div class="modal-actions">
        <button class="text-btn" @click="hideModal">Cancel</button>
        <button class="primary-btn" @click="block">Block</button>
      </div>
    </div>
  </div>
</template>

<script>
// Followed: https://v2.vuejs.org/v2/examples/modal.html
export default {
  name: 'BlockModal',
  props: {
    username: {
      type: String,
      required: true,
    },
    hideModal: {
      type: Function,
      required: true,
    },
  },
  methods: {
    async block() {
      const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ blockee: this.username }),
      };
      try {
        const res = await fetch('/api/blocks', options);
        const blockObj = await res.json();
        this.$store.commit('refreshBlocks');
        this.$store.commit('alert', {
          message: `You have successfully blocked @${this.username}`,
          status: 'success',
        });
      } catch (e) {
        this.$store.commit('alert', {
          message: `Failed to block @${this.username}: ${e}`,
          status: 'error',
        });
      }
      this.hideModal();
    },
    async unblock() {
      const options = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
      };
      const url = `/api/blocks/${this.$store.state.blockedUsers[this.username]}`;
      try {
        const res = await fetch(url, options);
        this.$store.commit('refreshBlocks');
        this.$store.commit('alert', {
          message: `You have successfully unblocked @${this.username}`,
          status: 'success',
        });
      } catch (e) {
        this.$store.commit('alert', {
          message: `Failed to unblock @${this.username}: ${e}`,
          status: 'error',
        });
      }
      this.hideModal();
    }
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9998;
}
.modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 8px;
  z-index: 9999;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
}
</style>