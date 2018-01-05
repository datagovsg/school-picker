<template>
  <div class="item multiple-lines l1r5-tab">
    <div class="item-content">
      <strong><small class="item-title text-primary">EXPECTED L1R5</small></strong>
      <q-select class="block"
        :class="value ? 'text-primary active' : 'text-grey'"
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
      _options: state => state.l1r5.options,
      value: state => state.l1r5.selected
    }),
    options () {
      if (this.value) return [{label: 'None', value: null}, ...this._options]
      else return this._options
    }
  },
  methods: {
    onInput (value) {
      if (value !== this.value) {
        this.$store.commit('updateSelected', {module: 'l1r5', updated: value})
        this.$store.dispatch('exportOptions').then(query => this.$router.push({query}))
      }
    }
  }
}
</script>

<style lang="scss">
.l1r5-tab {
  .q-picker-textfield::after {
    content: url('/assets/Dropdown.svg')!important;
  }

  .q-picker-textfield .q-picker-textfield-value {
    color: inherit;
  }
}
</style>
