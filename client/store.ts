import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown freets by (null = show all)
    freets: [], // All freets created in the app
    comments: {}, // Mapping of freetId to its comments
    commentsFilter: {}, // Mapping of freetId to its comment filter
    username: null, // Username of the logged in user
    alerts: {}, // global success/error messages encountered during submissions to non-visible forms
    blockedUsers: {},
    reactions: {},
    tags: {},
    filters: [],
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
    },
    addFilters(state, filterType) {
      state.filters.push({
        type: filterType,
        value: null,
      });
    },
    updateFilters(state, payload) {
      Vue.set(state.filters, payload.index, {
        ...state.filters[payload.index],
        value: payload.value
      });
    },
    deleteFilter(state, i) {
      Vue.delete(state.filters, i);
    },
    updateCommentFilter(state, payload) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      const { freetId, visibility } = payload;
      Vue.set(state.commentsFilter, freetId, visibility);
    },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    addBlock(state, block) {
      /**
       * Add blockee to the list of blocks
       * @param blockee - username to block
       */
      
      Vue.set(state.blockedUsers, block.blockee, block._id);
    },
    clearBlocks(state) {
      state.blockedUsers = {};
    },
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.filter ? `/api/users/${state.filter}/freets` : '/api/freets';
      const res = await fetch(url).then(async r => r.json());
      state.freets = res;
    },
    async refreshComments(state, freetId) {
      /**
       * Request the server for the currently available comments.
       * @param freetId - String Id of the freet to fetch comments for
       */
      let visibilityQuery = '';
      if (state.commentsFilter[freetId] !== 'all') {
        visibilityQuery = `&visibility=${state.commentsFilter[freetId]}`;
      }
      const res = await fetch(`/api/comments?freetId=${freetId}${visibilityQuery}`);
      const comments = await res.json();
      Vue.set(state.comments, freetId, comments);
    },
    async refreshBlocks(state) {
      /**
       * Request the server for the logged in user's blocks
       */
      const res = await fetch('/api/blocks?');
      const blocks = await res.json();
      state.blockedUsers = {};
      blocks.forEach(block => Vue.set(state.blockedUsers, block.blockee, block._id));
    },
    async refreshReacts(state, freetId) {
      /**
       * Request the server for the reactions for the freet with id freetId 
       */
       const res = await fetch(`/api/reactions?freetId=${freetId}`);
       const reactions = await res.json();
       const reactionTypes = [
        'LOVE',
        'HAHA',
        'SAD',
        'ANGRY',
        'LIKE',
        'DISLIKE',
      ];
      const freetReactions = reactionTypes.reduce((obj, type_) => {
        obj[type_] = {
          count: 0,
          selectedReactionId: null,
        };
        return obj;
      }, {});
      const allReactions = reactions.reduce((allReacts, reaction) => {
        allReacts[reaction.type].count++;
        if (reaction.issuer === state.username) {
          allReacts[reaction.type].selectedReactionId = reaction._id;
        }
        return allReacts;
      }, freetReactions);
      Vue.set(state.reactions, freetId, allReactions);
    },
    async refreshTags(state, freetId) {
      /**
       * Request the server for the reactions for the freet with id freetId 
       */
       const res = await fetch(`/api/tags?source=${freetId}`);
       const tags = await res.json();
       Vue.set(state.tags, freetId, tags);
    },
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
