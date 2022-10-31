<template>
  <article class="thread">
    <div
      v-for="comment in comments"
      :key="comment.id"
    >
      <CommentComponent
        :comment="comment"
      />
      <CommentThread
        v-if="comment.replies.length"
        :freetId="freetId"
        :commentId="comment.id"
        :comments="comment.replies"
      />
    </div>
  </article>
</template>

<script>
import CommentComponent from '@/components/Comment/CommentComponent.vue';

export default {
  name: 'CommentThread',
  components: {CommentComponent},
  props: {
    freetId: {
      type: String,
      required: true,
    },
    commentId: String,
    comments: Array,
  },
}
</script>

<style scoped>
.thread {
  margin-left: 24px;
}
</style>