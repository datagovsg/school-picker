<template>
  <div class="item multiple-lines school-level-tab">
    <div class="item-content">
      <strong><small class="item-title text-primary">EDUCATION LEVEL</small></strong>
      <q-select class="block"
        :class="value ? 'text-primary' : 'text-grey'"
        ref="select"
        type="list"
        :value="value"
        :options="options"
        @input="onInput" />
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  computed: {
    ...mapState({
      options: state => state.schoolLevel.options,
      value: state => state.schoolLevel.selected
    })
  },
  methods: {
    onInput (value) {
      if (value !== this.value) {
        this.$store.commit('updateSelected', {module: 'schoolLevel', updated: value})
        this.$store.dispatch('exportOptions').then(query => this.$router.push({query}))
      }
    }
  }
}
</script>

<style lang="scss">
.school-level-tab {
  .q-picker-textfield::after {
    content: url('/assets/Dropdown.svg')!important;
  }
}
</style>
