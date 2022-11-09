<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <BlockPanel :username="freet.author" class="freet">
    <article>
      <Post
        :post="freet"
        :request="request"
        :isPrivate="false"
      >
        <template #reactions>
          <hr/>
          <ReactionBar :freetId="freet._id"/>
        </template>

      </Post>
      <div class="comment-actions">
        <button
          class="text-btn"
          @click="showComments = !showComments"
          >
          {{ comments.length }} thread(s)
          <ExpandIcon :active="showComments"/>
        </button>
      </div>
      <div v-if="showComments">
        <template v-if="isLoggedIn() && comments.length > 0">
          <label for="visibility">Filter for:</label>
          <select
            name="visibility"
            :value="visibility"
            @change="onChange($event.target.value)"
          >
            <option value="all">All</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </template>
        <CreateCommentForm
          v-if="showComments"
          :freetId="freet._id"
        />
      </div>
      <CommentThread
        v-if="showComments"
        :freetId="freet._id"
        :comments="comments"
      />
    </article>
  </BlockPanel>
</template>

<script>

import Post from '@/components/common/Post.vue';
import LoginContent from '@/components/common/LoginContent.vue';
import BlockPanel from '@/components/Block/BlockPanel.vue';
import CommentThread from '@/components/Comment/CommentThread.vue';
import CreateCommentForm from '@/components/Comment/CreateCommentForm.vue';
import ReactionBar from '@/components/Reaction/ReactionBar.vue';
import ExpandIcon from '@/components/common/ExpandIcon.vue';

export default {
  name: 'FreetComponent',
  components: {Post, CommentThread, CreateCommentForm, ExpandIcon, BlockPanel, ReactionBar},
  mixins: [LoginContent],
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showComments: false,
      visibility: this.$store.state.commentsFilter[this.freet._id]
    }
  },
  mounted() {
    this.$store.commit('updateCommentFilter', {
      freetId: this.freet._id,
      visibility: 'all',
    });
    this.$store.commit('refreshComments', this.freet._id);
    this.$store.commit('refreshTags', this.freet._id);
  },
  computed: {
    comments() {
      return this.$store.state.comments[this.freet._id] || [];
    },
  },
  methods: {
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.successCallback - Function to run if the the request succeeds
       * @param params.failurreCallback - Function to run if the the request fails
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/freets/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.$store.commit('refreshFreets');

        params.successCallback();
      } catch (e) {
        params.failureCallback(e);

      }
    },
    onChange(newVisibility) {
      if (this.visibility !== newVisibility) {
        this.$store.commit('updateCommentFilter', {
          freetId: this.freet._id,
          visibility: newVisibility,
        });
        this.$store.commit('refreshComments', this.freet._id);
      }
      this.visibility = newVisibility;
    }
  }
};
</script>
<style scoped>
.freet {
  border: 1px solid black;
  margin-bottom: 16px;
}

.comment-actions {
  display: flex;
  padding: 8px 0;
}
.comment-actions > button {
  margin: auto;
}
</style>
