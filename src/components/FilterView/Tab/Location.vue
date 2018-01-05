<template>
  <div class="item multiple-lines location-tab">
    <div class="item-content">
      <strong><small class="item-title text-primary">NEAR LOCATION</small></strong>
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
    ...mapGetters('planningAreas', ['selectedDisplayText'])
  },
  methods: {
    ...mapActions(['resetOptions', 'exportOptions']),
    expand () {
      this.$emit('expand', 'location')
    },
    reset () {
      this.resetOptions({module: 'planningAreas'})
      this.exportOptions().then(query => this.$router.push({query}))
    }
  }
}
</script>

<style lang="scss">
.location-tab {
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
