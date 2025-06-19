<template>
  <span class="text-limit" style="max-width: 15rem; overflow: hidden">
    <span v-for="(artist, index) in array">
      <span @click.stop="to(artist.id)" class="link">{{
        artist.name
      }}</span>
      <span v-if="index < array.length - 1"> / </span>
    </span>
  </span>
</template>
<script>
export default {
  data() {
    return {}
  },
  props: ['array'],
  emits:['router-leave'],
  methods: {
    to(id) {
      if (id < 0 || !id) {
        return
      }
      this.$router.push({
        name: 'Artist',
        params: { id: id }
      })
      this.$emit('router-leave',id)
    }
  }
}
</script>
<style scoped>
.link {
  appearance: none;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  font-size: 0.85rem;
  color: inherit;
}
.link:hover {
  text-decoration: underline;
}
</style>
