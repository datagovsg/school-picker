<template>
  <q-modal class="picker-filter mobile tertiary" :backdrop-opacity="0.6">
    <div class="column">
      <big class="exit text-grey absolute-top-right cursor-pointer" @click="$children[0].close()">
        <i>clear</i>
      </big>
      <big class="filter-title text-primary text-bold">FILTERS</big>
      <div class="tab-list">
        <SchoolLevelTab @expand="openModal" />
        <component :is="DynamicTab" @expand="openModal" />
        <CcaTab @expand="openModal" />
        <MoreOptionsTab @expand="openModal" />
      </div>
    </div>

    <LocationModal ref="location" />
    <CcaModal ref="cca" />
    <MoreOptionsModal ref="more" />
    <div class="button-group" @click="$children[0].close()">
      <button class="bg-primary text-white text-bold">DONE</button>
    </div>
  </q-modal>
</template>

<script>
import SchoolLevelTab from './Tab/SchoolLevel'
import LocationTab from './Tab/Location'
import PsleTab from './Tab/PSLE'
import L1R5Tab from './Tab/L1R5'
import CcaTab from './Tab/Cca'
import MoreOptionsTab from './Tab/MoreOptions'

import LocationModal from './Modal/Location'
import CcaModal from './Modal/Cca'
import MoreOptionsModal from './Modal/MoreOptions'

export default {
  computed: {
    DynamicTab () {
      const schoolLevel = this.$store.state.schoolLevel.selected
      if (schoolLevel === 'S' || schoolLevel === 'T') return 'PsleTab'
      if (schoolLevel === 'J') return 'L1R5Tab'
      return 'LocationTab'
    }
  },
  methods: {
    openModal (id) {
      this.$refs[id].$children[0].open()
    }
  },
  components: {
    SchoolLevelTab,
    LocationTab,
    LocationModal,
    PsleTab,
    L1R5Tab,
    CcaTab,
    CcaModal,
    MoreOptionsTab,
    MoreOptionsModal
  }
}
</script>

<style lang="scss">
@import "~style/variables.scss";

.picker-filter.mobile {
  height: 100%;

  .modal-content {
    background: $color-tertiary;
    height: 100%;
    width: 100%;

    .column {
      big {
        text-align: center;
        background: $color-tertiary;

        &.filter-title {
          border-bottom: 1px solid rgba(128, 128, 128, 0.50);
          box-shadow: 0 1px 10px -3px rgba(128, 128, 128, 0.50);
          width: 100%!important;
          font-size: 1.2em;
          padding: 0.6em 0.8em 0.8em 0.8em;
          letter-spacing: 0.75px;
        }

        &.exit {
          padding: 6px 8px 10px;
        }
      }

      .tab-list {
        padding: 40px 30px 30px 30px;
      }
    }
  }

  .item {
    .item-content {
      padding-top: 16px;
      padding-bottom: 14px;
    }

    .item-title {
      padding-bottom: 5px;
    }
  }

  .q-picker-textfield {
    border-radius: 5px;
    background: $color-faded;
    height: 40px;
    padding: 10px 40px 0 15px!important;
    border-bottom: 0;
    border: 2px solid $color-faded;
    font-style: italic;

    &.active {
      background: $color-tertiary;
      font-style: normal;
    }

    &:hover, &:focus {
      border: 2px solid $color-faded;
    }

    &::after {
      height: 100%;
      width: 40px;
      top: 0;
      text-align: center;
      transform: none!important;
      padding: 9px 15px 0;
      background: $color-faded;
      content: url('/assets/Options.svg');
    }
  }


  .button-group {
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 0;

    button {
      width: 100%;
      height: 50px;
      border-radius: 0;
      letter-spacing: 0.75px;
    }
  }
}

.modal:not(.minimized).q-modal-enter .modal-content,
.modal:not(.minimized).q-modal-leave-active .modal-content {
  transform: translateX(0%);
}
</style>
