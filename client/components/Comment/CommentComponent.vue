<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <div>
    <Post
      :post="comment"
      :request="request"
      :isPrivate="comment.isPrivate"
    />
    <button @click="showForm = true" class="reply-btn">Reply</button>
      <div v-if="showForm" class="reply-form">
        <CreateCommentForm
          :freetId="comment.parentFreet"
          :commentId="comment._id"
          />
        <button @click="showForm = false">X</button>
      </div>
  </div>
</template>

<script>

import Post from '@/components/common/Post.vue';
import CreateCommentForm from '@/components/Comment/CreateCommentForm.vue';

export default {
  name: 'CommentComponent',
  components: {Post, CreateCommentForm},
  props: {
    // Data from the stored freet
    comment: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showForm: false,
    }
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
        const r = await fetch(`/api/comments/${this.comment._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.$store.commit('refreshComments', this.comment.parentFreet);
        params.successCallback();
      } catch (e) {
        params.failureCallback(e);

      }
    }
  }
};
</script>

<style scoped>
.reply-form {
  display: flex;
}
.reply-form > :first-child {
  flex-grow: 1;
}
</style>
