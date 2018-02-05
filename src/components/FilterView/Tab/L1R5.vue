<template>
  <div class="item multiple-lines l1r5-tab">
    <div class="item-content">
      <strong><small class="item-title text-primary">EXPECTED L1R5</small></strong>
      <small class="reset text-primary absolute-right cursor-pointer" @click="reset">reset</small>
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
      options: state => state.l1r5.options,
      value: state => state.l1r5.selected
    })
  },
  methods: {
    onInput (value) {
      if (value !== this.value) {
        this.$store.commit('updateSelected', {module: 'l1r5', updated: value})
        this.$store.dispatch('exportOptions').then(query => this.$router.push({query}))
      }
    },
    reset () {
      this.$store.commit('updateSelected', {module: 'l1r5', updated: null})
      this.$store.dispatch('exportOptions').then(query => this.$router.push({query}))
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

  .reset {
    height: 25px;
    margin-top: 12px;
    margin-right: 12px;
    padding: 4px;
    text-decoration: underline;

    .mobile & {
      padding-top: 5px;
    }
  }
}
</style>
