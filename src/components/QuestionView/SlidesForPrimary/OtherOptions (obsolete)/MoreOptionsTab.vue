<template>
  <div class="item multiple-lines">
    <div class="item-content">
      <strong><small class="item-title text-white">OTHER OPTIONS</small></strong>
      <div class="q-picker-textfield cursor-pointer textfield block"
        :class="{active: selectedDisplayText}"
        tabindex="0" @click="expand">
        <div class="q-picker-textfield-value ellipsis"
          :class="selectedDisplayText ? 'text-primary' : 'text-white'">
          {{selectedDisplayText || 'None selected'}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  computed: {
    ...mapGetters('extraOptions', ['selectedDisplayText'])
  },
  methods: {
    expand () {
      this.$emit('expand', 'more')
    }
  }
}
</script>
