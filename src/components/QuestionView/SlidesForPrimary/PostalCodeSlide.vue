<template>
  <div class="question-postal">
    <div class="container">
      <h5 class="text-white text-center">Set a home location</h5>
      <div class="postal-code-input">
        <input
          :class="{'has-error': !validated}"
          v-model="value"
          placeholder="Enter Postal Code"
          @keyup.enter="onKeyEnter" />
        <div class="button-group">
          <button class="text-white text-bold button-right" @click="onKeyEnter">next</button>
          <button class="text-primary text-bold button-left" @click="skip">skip</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex'

export default {
  data () {
    return {
      value: ''
    }
  },
  computed: {
    ...mapState(['postalCode']),
    validated () {
      return !this.value || this.value.match(/^\d{6}$/)
    }
  },
  methods: {
    ...mapMutations(['setPostalCode', 'setLocation']),
    ...mapActions(['locateAddress', 'exportOptions']),
    ...mapActions('homeSchoolDistance', ['queryOnemap']),
    reset () {
      this.setPostalCode(null)
      this.setLocation(null)
      this.exportOptions().then(query => this.$router.replace({query}))
    },
    onKeyEnter () {
      if (this.value && this.validated) {
        // if valid postal code is provided
        this.locateAddress(this.value)
        this.queryOnemap({postalCode: this.value})
      } else {
        this.reset()
      }
      this.$emit('next')
    },
    skip () {
      this.value = this.postalCode
      if (process.env.NODE_ENV === 'production') {
        window.ga('send', 'event', 'QuestionView', 'skip setting postal code')
      }
      this.$emit('next')
    }
  },
  mounted () {
    this.$watch('postalCode', function (value) {
      this.value = value
    }, {immediate: true})
  }
}
</script>

<style lang="scss">
@import "~style/variables.scss";

.question-postal {
  .container {
    margin-top: 200px;

    h5 {
      margin-top: 65px;
      margin-bottom: 0.85em;
    }

    .postal-code-input {
      width: 80%;
      margin: 0 auto;

      input {
        color: white;
        width: 100%;
        border: 2px solid $color-input-border;
        border-radius: 5px;
        margin-bottom: 0;
        padding: 15px 20px;

        &::placeholder {
          color: white;
          font-style: italic;
        }
      }
    }
  }
}


</style>
