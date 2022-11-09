<!-- Default page that also displays freets -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2>Welcome @{{ $store.state.username }}</h2>
      </header>
      <CreateFreetForm />
    </section>
    <section v-else>
      <header>
        <h2>Welcome to Fritter!</h2>
      </header>
      <article>
        <h3>
          <router-link to="/login">
            Sign in
          </router-link>
          to create, edit, and delete freets.
        </h3>
      </article>
    </section>
    <section>
      <header class="filters">
        <SelectedFilter
          v-for="(filter, i) in $store.state.filters"
          :filterObj="filter"
          :index="i"
        />
        <FreetFilter/>
      </header>
      <section
        v-if="$store.state.freets.length"
      >
        <FreetComponent
          v-for="freet in freets"
          :key="freet.id"
          :freet="freet"
        />
      </section>
      <article
        v-else
      >
        <h3>No freets found.</h3>
      </article>
    </section>
  </main>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import CreateFreetForm from '@/components/Freet/CreateFreetForm.vue';
import GetFreetsForm from '@/components/Freet/GetFreetsForm.vue';
import FreetFilter from '@/components/Filter/FreetFilter.vue';
import SelectedFilter from '@/components/Filter/SelectedFilter.vue';

export default {
  name: 'FreetPage',
  components: {FreetComponent, GetFreetsForm, CreateFreetForm, FreetFilter, SelectedFilter},
  mounted() {
    this.$store.commit('refreshFreets');
  },
  computed: {
    freets() {
      const groupedFilters = this.$store.state.filters.reduce((groups, f) => {
        if (!groups[f.type]) {
          groups[f.type] = [];
        }
        if (f.value !== null) {
          groups[f.type].push(f);
        }
        return groups;
      }, {});
      const allFreets = this.$store.state.freets.filter(freet => {
        if (groupedFilters['reaction'] && groupedFilters['reaction'].length > 0) {
          const reactType = groupedFilters['reaction'][0].value;
          const reacts = this.$store.state.reactions[freet._id];
          if (!reacts || reacts[reactType]?.count !== Math.max(...Object.values(reacts).map(r => r.count || 0))) {
            return false;
          }
        }
        if (groupedFilters['author'] && groupedFilters['author'].length > 0) {
          const author = groupedFilters['author'][0].value;
          if (author !== freet.author) {
            return false;
          }
        }
        if (groupedFilters['tag'] && groupedFilters['tag'].length > 0) {
          const freetTags = new Set((this.$store.state.tags[freet._id] || []).map(t => t.label));
          const hasAllTags = groupedFilters['tag'].every(tagFilter => freetTags.has(tagFilter.value));
          if (!hasAllTags) {
            return false;
          }
        }
        return true;
      });
      return allFreets;
    }
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

header, header > * {
    display: inline-block;
}

button {
    margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}

.filters {
  margin: 16px 0;
}
</style>
