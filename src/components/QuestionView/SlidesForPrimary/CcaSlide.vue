<template>
  <div class="question-cca">
    <div class="container">
      <h5 class="text-white text-center">What are your interests?</h5>
      <div class="selection-row">
        <div class="select-group" v-for="group in ccasOffered">
          <p class="text-secondary text-bold">{{group.label}}</p>
          <div class="select-one">
            <label class="ellipsis text-primary" v-for="cca in group.ccas">
              <q-checkbox :value="checked(cca)" @input="select(cca, $event)"/>
              {{cca.label}}
            </label>
          </div>
        </div>
      </div>
      <div class="button-group">
        <button class="text-white text-bold button-right" @click="$emit('next')">next</button>
        <button class="text-primary text-bold button-left" @click="skip">skip</button>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex'

export default {
  computed: {
    ...mapState({
      ccasOffered: state => state.ccasOffered.options
    }),
    ...mapGetters(['optionsSelected'])
  },
  methods: {
    ...mapActions([
      'selectOptions',
      'unselectOptions',
      'resetOptions'
    ]),
    // Check if the option has already been selected
    checked (options) {
      return this.optionsSelected({module: 'ccasOffered', options})
    },
    // Change checked state depending on selection state
    select (options, toCheck) {
      if (toCheck) {
        this.selectOptions({module: 'ccasOffered', options})
      } else {
        this.unselectOptions({module: 'ccasOffered', options})
      }
    },
    skip () {
      this.resetOptions({module: 'ccasOffered'}).then(() => {
        if (process.env.NODE_ENV === 'production') {
          window.ga('send', 'event', 'QuestionView', 'skip CCA filter')
        }
        this.$emit('next')
      })
    }
  }
}
</script>

<style lang="scss">
@import "~style/variables.scss";

.question-cca {
  h5 {
    margin-bottom: 0.7em;
  }

  .selection-row {
    margin: 25px 0;
    padding: 20px;
    border-radius: 5px;
    border: 2px solid $color-input-border;
    height: 50vh;
    overflow-y: auto;

    .mobile & {
      height: 45vh;

      @media (min-width: 600px) {
        height: 50vh;
      }
    }
  }

  .select-group {
    margin-bottom: 2em;

    p {
      font-size: 1em;
      margin-bottom: 0.5em;
    }

    &:last-of-type {
      margin-bottom: 0;
    }
  }

  .select-one {
    column-width: 200px;

    label {
      display: block;
      margin-bottom: 10px;
      font-size: 0.9em;
      white-space: nowrap;
      color: white!important;
    }

    .q-checkbox {
      height: 18px;
    }

    .q-checkbox input + div::before {
      width: 15px;
      height: 15px;
      border-radius: 4px;
      margin: auto;
      border: 1px solid white;
      background: white!important;
    }

    .q-checkbox input:checked + div::after {
      top: 3px;
      left: 2px;
      width: 4px;
      height: 8px;
      border-right: 1.5px solid $color-primary;
      border-bottom: 1.5px solid $color-primary;
      transform: rotate(45deg) translateZ(0);
    }
  }
}


</style>
