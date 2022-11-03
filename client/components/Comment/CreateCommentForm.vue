<!-- Form for creating comment (block style) -->

<template>
  <CreateForm
    v-if="isLoggedIn()"
    :placeholder="'Freet your reply'"
    :actionLabel="'Comment'"
    :request="request"
    :enableVisibility="commentId == null"
  />
</template>
<script>
import CreateForm from '@/components/common/CreateForm.vue';
import LoginContent from '@/components/common/LoginContent.vue';

export default {
  name: 'CreateCommentForm',
  components: {CreateForm},
  mixins: [LoginContent],
  props: {
    freetId: {
      type: String,
      required: true,
    },
    commentId: String, // If provided then responding to a comment
  },
  methods: {
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.options - Request options
       * @param params.successCallback - Function to run if the the request succeeds
       * @param params.failureCallback - Function to run if the the request fails
       */
      try {
        let replyPath = '';
        const { options } = params;
        if (this.commentId) {
          replyPath = '/replies';
          options.body['commentId'] = this.commentId;
        } else {
          options.body['freetId'] = this.freetId;
        }
        options.body = JSON.stringify(options.body);

        const r = await fetch(`/api/comments${replyPath}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.$store.commit('refreshComments', this.freetId);
        params.successCallback();
      } catch (e) {
        params.failureCallback(e);
      }
    }

  }
};
</script>
