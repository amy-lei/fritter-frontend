<!--
    Reusable component representing a post. Posts must have an author, content, dateModified field.
 -->
<template>
  <article
    class="post"
    :class="{ isPrivate: isPrivate }"
  >
    <header>
      <ProfileComponent
        :username="post.author"
        :showName="true"
      />
      <div
        v-if="$store.state.username === post.author"
        class="actions"
      >
        <button
          v-if="editing"
          @click="submitEdit"
        >
          ✅ Save changes
        </button>
        <button
          v-if="editing"
          @click="stopEditing"
        >
          🚫 Discard changes
        </button>
        <button
          v-if="!editing"
          @click="startEditing"
        >
          ✏️ Edit
        </button>
        <button @click="deletePost">
          🗑️ Delete
        </button>
      </div>
      <div
        v-else
        class="actions"
      >
        <button
          @click="showBlockModal = true"
        >
          🚩
        </button>
        <BlockModal
          v-if="showBlockModal"
          :username="post.author"
          :hideModal="hideBlockModal"
        />
      </div>
    </header>
    <textarea
      v-if="editing"
      class="content"
      :value="draft"
      @input="draft = $event.target.value"
    />
    <p
      v-else
      class="content"
    >
      {{ post.content }}
    </p>
    <p class="info">
      Posted at {{ post.dateModified }}
      <i v-if="post.edited">(edited)</i>
    </p>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>
  
<script>
import ProfileComponent from '@/components/common/Profile.vue';
import BlockModal from '@/components/Block/BlockModal.vue';

export default {
  name: 'Post',
  components: {ProfileComponent, BlockModal},
  props: {
    // Data from the stored post
    post: {
      type: Object,
      required: true,
    },
    isPrivate: Boolean,
    request: {
      type: Function,
      required: true,
    }
  },
  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      draft: this.post.content, // Potentially-new content for this freet
      alerts: {}, // Displays success/error messages encountered during freet modification
      showBlockModal: false,
      showContent: true,
    };
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.post.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      this.draft = this.post.content;
    },
    deletePost() {
      /**
       * Deletes this post.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    submitEdit() {
      /**
       * Updates post to have the submitted draft content.
       */
      if (this.post.content === this.draft) {
        const error = 'Error: Edited content should be different than current content.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PATCH',
        message: 'Successfully edited content!',
        body: JSON.stringify({content: this.draft}),
        successCallback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        },
        failureCallback: (e) => {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        },
      };
      this.request(params);
      this.editing = false;
    },
    blockUser() {
      this.hideBlockModal();
    },
    hideBlockModal() {
      this.showBlockModal = false;
    },
  }
};
</script>

<style scoped>

* {
  box-sizing: border-box;
}
.post {
  border: 1px solid #111;
  padding: 20px;
  position: relative;
}
.post.isPrivate {
  background-color: #e0e0e5;
}
</style>
