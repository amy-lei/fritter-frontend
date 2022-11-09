<template>
  <div class="reaction-bar">
    <ReactionButton
      v-for="(metadata, reactType) in reactions"
      :reactType="reactType"
      :count="metadata.count"
      :reactionId="metadata.selectedReactionId"
      :freetId="freetId"
    />
  </div>
</template>

<script>
import ReactionButton from '@/components/Reaction/ReactionButton.vue';

export default {
  name: 'ReactionBar',
  components: {ReactionButton},
  props: {
    freetId: {
      type: String,
      required: true,
    },
  },
  beforeMount() {
    this.$store.commit('refreshReacts', this.freetId);
  },
  computed: {
    reactions() {
      return this.$store.state.reactions[this.freetId] || [];
    }
  }
}
</script>
<style scoped>
.reaction-bar {
  display: flex;
  justify-content: space-between;
}
</style>