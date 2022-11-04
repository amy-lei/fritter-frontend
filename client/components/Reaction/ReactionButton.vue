<template>
  <button
    class="toggle-btn reaction"
    :class="{ selected: !!reactionId }"
    @click="reactionId ? unreact() : react()"
    >
    <p class="emoji">{{ emoji }}</p>
    <p class="count">{{ count || 0 }}</p>
  </button>
</template>
<script>
export default {
  name: 'ReactionComponent',
  props: {
    reactType: {
      type: String,
      required: true,
    },
    freetId: {
      type: String,
      required: true,
    },
    reactionId: String, // If present, then the user selected this react
    count: Number,
  },
  computed: {
    emoji() {
      switch(this.reactType) {
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
    }
  },
  methods: {
    async react() {
      const body = {
        type: this.reactType,
        freetId: this.freetId,
      };
      const options = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body),
      };
      try {
        const r = await fetch('/api/reactions', options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        this.$store.commit('refreshReacts', this.freetId);
      } catch (e) {
        this.$store.commit('alert', {
          message: `Failed to react to freet: ${e}`,
          status: 'error'
        });
      }

    },
    async unreact() {
      const url = `/api/reactions/${this.reactionId}`;
      const options = {
        method: 'DELETE',
      };
      try {
        const r = await fetch(url, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        this.$store.commit('refreshReacts', this.freetId);
      } catch (e) {
        this.$store.commit('alert', {
          message: `Failed to unreact to freet: ${e}`,
          status: 'error'
        });
      }
    },
  }
}
</script>
<style scoped>
.reaction {
  padding: 4px 12px;
}
.reaction > p {
  display: inline;
}
.count {
  margin: 0 8px 0 12px;
}
</style>