<!-- Form for creating freets (block style) -->

<template>
  <CreateForm
    class="create-freet"
    :placeholder="'What\'s happening'"
    :actionLabel="'Freet'"
    :request="request"
    :enableTags="true"
  >
    <template #tags>
      <TagComponent
        v-for="(tag, i) in tags"
        :tag="tag"
        :editing="true"
        :deletable="true"
        :updateTag="(value) => updateTag(i, value)"
        :deleteTag="() => deleteTag(i)"
      />
    </template>
    <template #add>
      <button
        class="text-btn"
        @click="$event.preventDefault(); addTag()"
      >
        + Add tags
      </button>
    </template>
  </CreateForm>
</template>
<script>
import CreateForm from '@/components/common/CreateForm.vue';
import TagComponent from '@/components/Tag/TagComponent.vue'

export default {
  name: 'CreateFreetForm',
  components: {CreateForm, TagComponent},
  data() {
    return {
      tags: [],
    }
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
      if (this.tags.some(tag => !tag)) {
        const message = 'Cannot have empty tags';
        params.failureCallback('Tags cannot be empty');
        return;
      }
      const options = {
        ...params.options,
        body: JSON.stringify(params.options.body),
      };
      try {
        const r = await fetch(`/api/freets`, options);
        const res = await r.json()
        if (!r.ok) {
          throw new Error(res.error);
        } else {
          const freetId = res.freet._id;
          const tagR = await Promise.all(this.tags.map((tag) => this.createTag(freetId, tag)));
          this.$store.commit('refreshTags', freetId);
          this.tags = [];
        }
        this.$store.commit('refreshFreets');
        params.successCallback();
      } catch (e) {
        params.failureCallback(e);
      }
    },
    async createTag(freetId, tag) {
      const options = {
        method: 'POST', 
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin',
        body: JSON.stringify({
          source: freetId,
          label: tag,
        }),
      };
      return fetch('/api/tags', options);
    },
    addTag() {
      this.tags.push('');
    },
    updateTag(i, value) {
      this.tags[i] = value;
    },
    deleteTag(i) {
      this.$delete(this.tags, i);
    },
  }
};
</script>

<style scoped>
.create-freet {
  border: 1px solid #555555;
  border-radius: 8px;
}
</style>