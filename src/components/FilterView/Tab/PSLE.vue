<template>
  <div class="item multiple-lines psle-tab">
    <div class="item-content">
      <strong><small class="item-title text-primary">EXPECTED AGGRE</small></strong>
      <small class="reset text-primary absolute-right cursor-pointer" @click="reset">reset</small>
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
      options: state => state.psle.options,
      value: state => state.psle.selected
    })
  },
  methods: {
    onInput (value) {
      if (value !== this.value) {
        this.$store.commit('updateSelected', {module: 'psle', updated: value})
        this.$store.dispatch('exportOptions').then(query => this.$router.push({query}))
      }
    },
    reset () {
      this.$store.commit('updateSelected', {module: 'psle', updated: null})
      this.$store.dispatch('exportOptions').then(query => this.$router.push({query}))
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
