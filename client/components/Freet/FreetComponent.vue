<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article class="freet">
    <Post
      :post="freet"
      :request="request"
      :isPrivate="false"
    />
    <div>
      <div v-if="comments.length">
        <button
          v-if="showComments"
          @click="showComments = false"
        >
          Hide comments
        </button>
        <button
          v-else
          @click="showComments = true"
        >
          View comments
        </button>
      </div>
      <CreateCommentForm
        :freetId="freet._id"
      />
    </div>
    <CommentThread
      v-if="showComments"
      :freetId="freet._id"
      :comments="comments"
    />
  </article>
</template>

<script>

import Post from '@/components/common/Post.vue';
import CommentThread from '@/components/Comment/CommentThread.vue';
import CreateCommentForm from '@/components/Comment/CreateCommentForm.vue';

export default {
  name: 'FreetComponent',
  components: {Post, CommentThread, CreateCommentForm},
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
    }
  },
  mounted() {
    this.$store.commit('refreshComments', this.freet._id);
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
    }
  }
};
</script>
<style scoped>
.freet {
  border: 1px solid black;
}
</style>
