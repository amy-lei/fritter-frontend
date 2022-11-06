<template>
  <div class="tag-form">
    <label>#</label>
    <template v-if="editing">
      <input
        type="text"
        :value="tag"
        @change="updateTag($event.target.value)"
      />
      <button @click="$event.preventDefault(); deleteTag()">
        X
      </button>
    </template>
    <template v-else>
      <p class="tag-label">{{ tag }}</p>
    </template>
  </div>
</template>

<script>
export default {
  name: 'TagComponent',
  props: {
    tag: String,
    editing: Boolean,
    updateTag: {
      type: Function,
      required: true,
    },
    deleteTag: {
      type: Function,
      required: true,
    },
  },
}
</script>

<style scoped>
.tag-form {
  display: inline-flex;
  margin: 0 4px 4px 0;
}

.tag-form > * {
  background-color: #ececec;
}
.tag-form > label {
  border-radius: 100px 0 0 100px;
  padding: 4px 4px 4px 8px;
}

.tag-form > button {
  border-radius: 0 100px 100px 0;
  padding: 4px 8px;
  color: transparent;
  font-size: 14px;
  transition: color .1s ease-in;
}

.tag-form > button:hover {
  color: black;
}

.tag-form > input {
  border: 0;
  padding: 4px;
  max-width: 130px;
}

.tag-form > input:focus {
  outline: none;
}

.tag-form > .tag-label {
  margin: 0;
  padding: 4px 12px 4px 0;
  border-radius: 0 100px 100px 0;
}

</style>