<template>
  <article class="picker-list-card">
    {{info.name}} <span class="glyphicon" :class="starClass" @click.stop="$emit('bookmark', info.code)" />
  </article>
</template>

<script>
export default {
  props: {
    info: Object,
    bookmarked: Boolean
  },
  computed: {
    starClass () {
      return {
        'glyphicon-star': this.bookmarked,
        'glyphicon-star-empty': !this.bookmarked
      }
    }
  }
}
</script>

<style>
</style>
