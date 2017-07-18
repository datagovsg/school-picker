<template>
  <div class="question-other">
    <div class="container">
      <h5 class="text-white text-center">Any other interests?</h5>
      <!-- <LocationModal ref="location" /> -->
      <CcaModal ref="cca" />
      <MoreOptionsModal ref="more" />
      <!-- <LocationTab @expand="openModal" /> -->
      <CcaTab @expand="openModal" />
      <MoreOptionsTab @expand="openModal" />
      <div class="button-group">
        <button class="text-white text-bold button-right" @click="$emit('done')">done</button>
      </div>

    </div>

  </div>
</template>

<script>
import CcaTab from './OtherOptions/CcaTab'
import CcaModal from '../../FilterView/TabsForPrimary/CcaModal'
import MoreOptionsTab from './OtherOptions/MoreOptionsTab'
import MoreOptionsModal from '../../FilterView/TabsForPrimary/MoreOptionsModal'

export default {
  methods: {
    openModal (id) {
      this.$refs[id].$children[0].open()
    }
  },
  components: {
    // LocationTab,
    // LocationModal,
    CcaTab,
    CcaModal,
    MoreOptionsTab,
    MoreOptionsModal
  }

}
</script>

<style lang="scss">
.question-other {
  .container {
    margin-top: 200px;

    h5 {
      margin-bottom: 0.7em;
    }

    .item-content {
      border-radius: 5px;
      padding: 5px 0;
      margin: 5px;

      .q-picker-textfield {
        background: #626a77;
        border-radius: 5px;
        padding: 10px 5px;
        margin: 5px 0;
        border: 2px solid #626a77;
        padding: 13px;

        &.active {
          background: #cecece;
          font-style: normal;
        }

        &:hover, &:focus {
          border: 2px solid #ebebeb;
        }

        &::after {
          height: 100%;
          width: 40px;
          top: 0;
          text-align: center;
          border-left: 1px solid #cecece;
          transform: none!important;
          padding: 13px 14px 0 15px;
          background: #ebebeb;
          content: url('/assets/Options.svg');
        }

      }
    }
  }
}


</style>
