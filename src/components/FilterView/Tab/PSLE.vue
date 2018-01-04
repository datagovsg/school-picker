<template>
  <div class="item multiple-lines psle-tab">
    <div class="item-content">
      <strong><small class="item-title text-primary">EXPECTED AGGREGATE</small></strong>
      <q-select class="block"
        :class="value ? 'text-primary' : 'text-grey'"
        ref="select"
        type="list"
        :value="value"
        :options="options"
        @input="onInput"
        placeholder="None selected" />
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  computed: {
    ...mapState({
      _options: state => state.psle.options,
      value: state => state.psle.selected
    }),
    options () {
      if (this.value) return [{label: 'None', value: null}, ...this._options]
      else return this._options
    }
  },
  methods: {
    onInput (value) {
      if (value !== this.value) {
        this.$store.commit('updateSelected', {module: 'psle', updated: value})
        this.$store.dispatch('exportOptions').then(query => this.$router.push({query}))
      }
    }
  }
}
</script>

<style lang="scss">
.psle-tab {
  .q-picker-textfield::after {
    content: url('/assets/Dropdown.svg')!important;
  }

  .q-picker-textfield .q-picker-textfield-value {
    color: inherit;
  }
}
</style>
