<template>
  <div class="picker-filter toolbar tertiary no-padding">
    <SearchBox />
    <div class="row auto">
      <SchoolLevelTab class="width-1of4" />
      <LocationTab class="width-1of4" @expand="openModal" />
  	  <CcaTab class="width-1of4" @expand="openModal" />
  	  <MoreOptionsTab class="width-1of4" @expand="openModal" />
    </div>

    <LocationModal ref="location" />
    <CcaModal ref="cca" />
    <MoreOptionsModal ref="more" />
  </div>
</template>

<script>
import SchoolLevelTab from './SchoolLevelTab'
import LocationTab from './LocationTab'
import LocationModal from './LocationModal'
import CcaTab from './CcaTab'
import CcaModal from './CcaModal'
import MoreOptionsTab from './MoreOptionsTab'
import MoreOptionsModal from './MoreOptionsModal'
import SearchBox from './SearchBox'

export default {
  methods: {
    openModal (id) {
      this.$refs[id].$children[0].open()
    }
  },
  components: {
    SchoolLevelTab,
    LocationTab,
    LocationModal,
    CcaTab,
    CcaModal,
    MoreOptionsTab,
    MoreOptionsModal,
    SearchBox
  }
}
</script>

<style lang="scss">
$color-faded: #EDEDED;
$color-tertiary: #CECECE;
$color-border: #B8B8B8;

.picker-filter {
  overflow-x: hidden;
  height: 100px;

  .item-title {
    display: block;
    padding-bottom: 10px;
    letter-spacing: 0.75px;
  }

  .width-1of4 {
    min-width: 210px;
    border-left: 2px solid $color-border;
    height: 100px;

    &:first-child {
      border-left: none;
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
  }

  & > .item:first-child {
    flex: 0 0 450px;
  }
}




</style>
