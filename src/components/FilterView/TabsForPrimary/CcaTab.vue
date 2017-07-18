<template>
  <div class="item multiple-lines cca-tab">
    <div class="item-content">
      <strong><small class="item-title text-primary">CCAs</small></strong>
      <small class="reset text-primary absolute-right cursor-pointer" @click="reset">reset</small>
      <div class="q-picker-textfield cursor-pointer textfield block"
        :class="{active: selectedDisplayText}"
        tabindex="0" @click="expand">
        <div class="q-picker-textfield-value ellipsis"
          :class="selectedDisplayText ? 'text-primary' : 'text-grey'">
          {{selectedDisplayText || 'None selected'}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
export default {
  computed: {
    ...mapGetters('ccasOffered', ['selectedDisplayText'])
  },
  methods: {
    ...mapActions(['resetOptions', 'exportOptions']),
    expand () {
      this.$emit('expand', 'cca')
    },
    reset () {
      this.resetOptions({module: 'ccasOffered'})
      this.exportOptions().then(query => this.$router.push({query}))
    }
  }
}
</script>

<style lang="scss">
.cca-tab {
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
