<!-- Reusable component representing a form in a block style -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <form @submit.prevent="submit">
    <article>
      <ProfileComponent
        :username="$store.state.username"
      />
      <div class="post-body">
        <textarea
          :name="content"
          :value="content"
          :placeholder="placeholder"
          @input="content = $event.target.value"
        />
        <slot name="tags"></slot>
      </div>
    </article>
    <div class="create-actions">
      <div class="create-metadata">
        <div v-if="enableVisibility">
          <input
            type="checkbox"
            :checked="isPrivate"
            @change="isPrivate = $event.target.checked"
          />
          <label>private</label>
        </div>
        <slot name="add"></slot>
    </div>
      <button
        type="submit"
        class="primary-btn"
      >
        {{ actionLabel }}
      </button>
    </div>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </form>
  </template>
  
  <script>
  import ProfileComponent from '@/components/common/Profile.vue'

  export default {
    name: 'CreateForm',
    components: {ProfileComponent},
    props: {
      placeholder: String,
      actionLabel: String,
      request: {
        type: Function,
        required: true,
      },
      enableVisibility: Boolean,
      enableTags: Boolean,
      body: Object, // Additional metadata for request body
    },
    data() {
      return {
        content: '', 
        isPrivate: false,
        alerts: {}, // Displays success/error messages encountered during form submission
      };
    },
    methods: {
      async submit() {
        /**
          * Submits a form with the specified options from data().
          */
        const options = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          credentials: 'same-origin' // Sends express-session credentials with request
        };
        const body = {
          ...(this.body || {}),
          content: this.content,
        }
        if (this.enableVisibility) {
          body['visibility'] = this.isPrivate ? 'private' : 'public';
        }
        options.body = body;

        const params = {
          options,
          successCallback: () => {
            const message = 'Successfully created!';
            this.$set(this.alerts, message, 'success');
            this.content = '';
            setTimeout(() => this.$delete(this.alerts, message), 3000);
          },
          failureCallback: (e) => {
            this.$set(this.alerts, e, 'error');
            setTimeout(() => this.$delete(this.alerts, e), 3000);
          }
        };
        this.request(params);
      },
    }
  };
  </script>
  
  <style scoped>
  form {
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
  }

  form > article {
    display: flex;
    align-items: flex-start;
  }

  form > article p {
    margin: 0;
  }
  
  form h3,
  form > * {
    margin: 0.3em 0;
  }
  
  form h3 {
    margin-top: 0;
  }
  
  textarea {
    font-family: inherit;
    font-size: inherit;
    padding: 8px;
    border: 0;
    width: 100%;
    background: transparent;
  }
  
  .post-body {
    flex-grow: 1;
  }

  .create-actions {
    display: flex;
    align-items: center;
  }
  .create-metadata {
    margin-left: auto;
    margin-right: 12px;
  }

  </style>
  