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
          class="slim"
          @click="submitEdit"
        >
          ✅ Save
        </button>
        <button
          v-if="editing"
          class="slim"
          @click="stopEditing"
        >
          🚫 Discard
        </button>
        <button
          v-if="!editing"
          class="slim"
          @click="startEditing"
        >
          ✏️
        </button>
        <button
          class="slim"
          @click="deletePost"
        >
          🗑️
        </button>
      </div>
      <div
        v-else-if="isLoggedIn()"
        class="actions"
      >
        <button
          class="toggle-btn"
          :class="{ selected: post.author in $store.state.blockedUsers }"
          @click="showBlockModal = true"
        >
          🚫 {{ post.author in $store.state.blockedUsers ? 'Unblock': 'Block' }}
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
      <i v-if="post.dateModified !== post.dateCreated">(edited)</i>
    </p>
    <slot name="actions"></slot>
    <div v-if="tags">
      <TagComponent
        v-for="(tag, i) in tags"
        :tag="editedTags[tag._id] || tag.label"
        :editing="editing"
        :updateTag="(value) => updateTag(tag._id, i, value)"
        :deleteTag="() => deleteTag(tag._id)"
      />
      <template v-if="editing">
        <TagComponent
          v-for="(tag, i) in newTags"
          :tag="tag"
          :editing="true"
          :updateTag="(value) => updateNewTag(i, value)"
          :deleteTag="() => deleteNewTag(i)"
        />
        <button
          class="text-btn"
          @click="$event.preventDefault(); addTag()"
        >
          + Add tags
        </button>
      </template>
    </div>
    <slot name="reactions"></slot>
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
import LoginContent from '@/components/common/LoginContent.vue';
import TagComponent from '@/components/Tag/TagComponent.vue'
import BlockModal from '@/components/Block/BlockModal.vue';

export default {
  name: 'Post',
  components: {BlockModal, ProfileComponent, TagComponent},
  mixins: [LoginContent],
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
      showContent: true,
      editedTags: {},
      newTags: [],
      showBlockModal: false,
    };
  },
  computed: {
    tags() {
      const tags = this.$store.state.tags[this.post._id];
      if (!tags) {
        return tags;
      }
      return tags.filter(tag => {
        const id = tag._id;
        return !(id in this.editedTags) ||  this.editedTags[id] !== null;
      });
    }
  },
  methods: {
    hideBlockModal() {
      this.showBlockModal = false;
    },
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
      this.editedTags = {};
      this.newTags = [];
    },
    deletePost() {
      /**
       * Deletes this post.
       */
      const params = {
        method: 'DELETE',
        successCallback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted!', status: 'success'
          });
        },
        failureCallback: (e) => {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        },
      };
      this.request(params);
    },
    async submitEdit() {
      /**
       * Updates post to have the submitted draft content.
       */
      const contentUnchanged = this.post.content === this.draft;
      const tagUnchanged = Object.keys(this.editedTags).length === 0;
      const newTags = this.newTags.length > 0;
      if (contentUnchanged && tagUnchanged && !newTags) {
        const error = 'Error: Edited tags/content should be different than current tags/content';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      // Check content on the FE rather than the BE so that partial changes aren't made.
      const MIN_LEN = 1;
      const MAX_LEN = 15;
      const tagContents = [
        ...Object.values(this.editedTags),
        ...this.newTags,
      ];
      const invalidTagLengths = tagContents.some(
          val => val !== null && (val.length < MIN_LEN || val.length > MAX_LEN));
      if (invalidTagLengths) {
        const error = `Error: Tags must be between ${MIN_LEN} and ${MAX_LEN} characters long.`;
        this.$set(this.alerts, error, 'error');
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }
      const invalidTagValues = tagContents.some(
          val => val && val.match(/[^0-9a-z]/i));
      if (invalidTagValues) {
        const error = 'Error: Tags can only contain alphanumeric characters';
        this.$set(this.alerts, error, 'error');
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }
      const duplicateLabels = tagContents.length !== new Set(tagContents).size;
      if (duplicateLabels) {
        const error = 'Error: Posts cannot be tagged with the duplicate labels';
        this.$set(this.alerts, error, 'error');
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      if (!contentUnchanged) {
        const params = {
          method: 'PATCH',
          message: 'Successfully edited content!',
          body: JSON.stringify({content: this.draft}),
          successCallback: () => {
            this.$set(this.alerts, params.message, 'success');
            setTimeout(() => this.$delete(this.alerts, params.message), 3000);
          },
          failureCallback: (e) => {
            this.$set(this.alerts, e.message, 'error');
            setTimeout(() => this.$delete(this.alerts, e), 3000);
          },
        };
        this.request(params);
      }
      if (!tagUnchanged || newTags) {
        try {
          await Promise.all([this.saveTagEdits(), this.createTags()]);
          this.$store.commit('refreshTags', this.post._id);
          this.editedTags = {};
          this.newTags = [];
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
      }
      if (newTags) {
        this.createTags();
      }
      this.editing = false;
    },
    addTag() {
      this.newTags.push('');
    },
    updateNewTag(i, value) {
      this.newTags[i] = value;
    },
    deleteNewTag(i) {
      this.$delete(this.newTags, i);
    },
    async deleteTag(tagId) {
      this.$set(this.editedTags, tagId, null);
    },
    async updateTag(tagId, idx, value) {
      if (value === this.tags[idx].label) {
        this.$delete(this.editedTags, tagId);
        return;
      }
      this.$set(this.editedTags, tagId, value);
    },
    async saveTagEdits() {
      return Promise.all(Object.keys(this.editedTags).map(async (tagId) => {
        const options = {
          headers: {'Content-Type': 'application/json'}
        };
        if (this.editedTags[tagId] === null) {
          options.method = 'DELETE';
        } else {
          options.method = 'PATCH';
          options.body = JSON.stringify({
            label: this.editedTags[tagId],
          });
        }
        return fetch(`/api/tags/${tagId}`, options);
      }));
    },
    async createTags() {
      return Promise.all(this.newTags.map(tag => {
        const options = {
          method: 'POST', 
          headers: {'Content-Type': 'application/json'},
          credentials: 'same-origin',
          body: JSON.stringify({
            source: this.post._id,
            label: tag,
          }),
        };
        return fetch('/api/tags', options);
      }));
    },
  }
};
</script>

<style scoped>

* {
  box-sizing: border-box;
}
.post {
  padding: 20px;
  position: relative;
}

.post header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.post .info {
  font-size: 14px;
  font-style: italic;
  color: #555;
}
header .actions button + button {
 margin-left: 4px;
}
textarea {
  font-family: inherit;
  font-size: inherit;
  padding: 8px;
  border: 0;
  width: 100%;
  background:transparent;
}
</style>
