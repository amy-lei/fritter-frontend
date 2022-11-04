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
      const reactionTypes = [
        'LOVE',
        'HAHA',
        'SAD',
        'ANGRY',
        'LIKE',
        'DISLIKE',
      ];
      const reactions = reactionTypes.reduce((obj, type_) => {
        obj[type_] = {
          count: 0,
          selectedReactionId: null,
        };
        return obj;
      }, {});
      const allReactions = (this.$store.state.reactions[this.freetId] || []).reduce((allReacts, reaction) => {
        allReacts[reaction.type].count++;
        if (reaction.issuer === this.$store.state.username) {
          allReacts[reaction.type].selectedReactionId = reaction._id;
        }
        return allReacts;
      }, reactions);
      return allReactions;
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