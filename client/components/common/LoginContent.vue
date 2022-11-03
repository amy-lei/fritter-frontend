<script>
export default {
  name: 'LoginContent',
  methods: {
    isLoggedIn() {
      return !!this.$store.state.username;
    },
    isSameUser(username) {
      return this.$store.state.username === username;
    }
  }
}
</script>