<template>
  <div class="slider-container">
    <q-slider class="picker-question" dots @slide="slide">
      <SchoolLevelSlide slot="slide" @next="next" />
      <PostalCodeSlide slot="slide" @done="done" @back="back" @next="next"/>
      <CcaSlide slot="slide" @done="done" @back="back" @next="next"/>
      <OthersSlide slot="slide" @done="done" @back="back" @next="next"/>
    </q-slider>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
import {Dialog} from 'quasar-framework'
import SchoolLevelSlide from './SchoolLevelSlide'
import PostalCodeSlide from './PostalCodeSlide'
import CcaSlide from './CcaSlide'
import OthersSlide from './OthersSlide'

export default {
  methods: {
    ...mapActions(['exportOptions']),
    back () {
      this.$children[0].previous()
    },
    next () {
      this.$children[0].next()
    },
    done () {
      this.exportOptions().then(query => {
        if (this.$store.state.schoolLevel.selected) {
          // If school level has been selected, push query to router
          this.$router.push({path: '/explore', query})
        } else {
          // If not, redirect to first question and display notice
          this.$children[0].goToSlide(0)
          Dialog.create({
            message: 'Question cannot be left unanswered.',
            buttons: ['OK']
          })
        }
      })
    },
    slide () {
      this.exportOptions().then(query => {
        this.$router.replace({query})
      })
    }
  },
  components: {SchoolLevelSlide, PostalCodeSlide, CcaSlide, OthersSlide}
}
</script>

<style lang="scss">
@import "~style/variables.scss";

.slider-container {
    height: inherit;
    background-color: $color-primary;

  .picker-question {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 80%;
    min-height: 500px;
    margin: auto;

    div .container {
      max-width: 640px;
      margin: 0 auto;
      overflow: hidden;
      white-space: normal;
    }

    .q-slider-toolbar {
      display: fixed;

      i {
        color: $color-secondary;
      }
    }

    .branding {
      font-weight: 300;
      letter-spacing: 3px;
      font-size: 0.6em;

      strong {
        font-weight: 500;
      }

      .logo {
        width: 200px;
        vertical-align: middle;
        margin-right: 10px;
        margin-bottom: 30px;
      }
    }
  }

  .button-group {
    margin-top: 10px;

    button {
      float: right;
      background-color: $color-secondary;
      border-radius: 5px;

      &:hover {
        color: $color-primary!important;
      }
    }

    .button-left {
      float: left;
      background-color: $color-primary;
      color: $color-faded!important;
      border: 2px solid $color-input-border;

      &:hover {
        background-color: white!important;
        color: $color-primary!important;
      }
    }
  }
}
</style>
