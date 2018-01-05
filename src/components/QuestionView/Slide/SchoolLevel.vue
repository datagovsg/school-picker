<template>
  <div class="question-level">
    <div class="container">
      <div class="text-white text-center branding"><img class="logo" src="/assets/SP_Logo.svg"></img></div>
      <h5 class="text-white text-center">Select an education level</h5>
      <!-- Options has been limited to just primary, secondary and junior college, remove slice to show all possible options -->
      <q-list-item v-for="option in options.slice(0,3)" link :item="option" @click.native="onInput(option.value)"></q-list-item>

    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  computed: {
    ...mapState({
      options: state => state.schoolLevel.options,
      selected: state => state.schoolLevel.selected
    })
  },
  methods: {
    onInput (value) {
      this.$store.commit('updateSelected', {module: 'schoolLevel', updated: value})
      this.$store.dispatch('exportOptions').then(query => this.$router.replace({query}))
      this.$emit('next')
    }
  }
}
</script>

<style lang="scss">
@import "~style/variables.scss";

.question-level {
  h5 {
    margin-bottom: 1em;
  }

  .container {
    height: 85%;

    .select-one {
      overflow: scroll;
      height: 400px;
    }
  }

  label {
    display: block;
    font-size: 1.2em;
    margin-bottom: 1.5em;

    &:last-of-type {
      margin-bottom: 2em;
    }
  }

  .item {
    width: 250px;
    border: 2px solid $color-input-border;
    margin: 10px auto;
    border-radius: 3px;

    .item-content {
      text-align: center;
      color: white;
    }
    .item-content:hover {
      color: $color-primary!important;
    }
  }

  .item.item-link:hover {
    background: $color-secondary!important;
  }
}
</style>
