<!-- Form for creating freets (block style) -->

<template>
  <CreateForm
    :placeholder="'What\'s happening'"
    :actionLabel="'Freet'"
    :request="request"
  />
</template>
<script>
import CreateForm from '@/components/common/CreateForm.vue';

export default {
  name: 'CreateFreetForm',
  components: {CreateForm},
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
        const r = await fetch(`/api/freets`, params.options);
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
