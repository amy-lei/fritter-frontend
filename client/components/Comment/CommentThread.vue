<template>
  <article class="thread">
    <div
      v-for="(comment, i) in comments"
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
.thread .thread {
  margin-left: 24px;
  border-left: 1px solid #000;
}
.comment-border-link {
    display: block;
    position: absolute;
    top: 50px;
    left: 0;
    width: 12px;
    height: calc(100% - 50px);
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    background-color: rgba(0, 0, 0, 0.1);
    background-clip: padding-box;
}

</style>