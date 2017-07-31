<template>
  <q-modal content-classes="filter-more-modal" @close="onClose">
    <big class="exit text-grey absolute-top-right cursor-pointer" @click="$children[0].close()"><i>clear</i></big>
    <big class="title text-primary text-bold">MORE OPTIONS</big>
    <div>
      <div class="selection-row">
        <div class="select-group"
          v-for="(group, module) in extraOptions">
          <p class="text-secondary text-bold">{{group.label}}</p>
          <div class="select-one column">
            <label class="text-primary ellipsis" v-for="type in group.types">
              <q-checkbox :value="checked(module, type)" @input="select(module, type, $event)" />
              {{type.label}}
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="button-group">
      <button class="exit-done primary float-right" @click="$children[0].close()">DONE</button>
      <button class="exit-reset primary float-right" @click="resetAll()">RESET</button>
    </div>
  </q-modal>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex'

export default {
  computed: {
    ...mapState({
      extraOptions: state => ({
        distinctiveProgrammes: state.distinctiveProgrammes.options,
        schoolTypes: state.schoolTypes.options,
        specialNeeds: state.specialNeeds.options
      })
    }),
    ...mapGetters(['optionsSelected'])
  },
  methods: {
    ...mapActions([
      'selectOptions',
      'unselectOptions',
      'exportOptions',
      'resetOptions'
    ]),
    checked (module, options) {
      return this.optionsSelected({module, options})
    },
    select (module, options, toCheck) {
      if (toCheck) this.selectOptions({module, options})
      else this.unselectOptions({module, options})
    },
    resetAll () {
      this.resetOptions({module: 'specialNeeds'})
      this.resetOptions({module: 'schoolTypes'})
      this.resetOptions({module: 'distinctiveProgrammes'})
    },
    onClose () {
      this.exportOptions().then(query => this.$router.push({query}))
    }
  }
}
</script>

<style lang="scss">
@import "~style/variables.scss";

.filter-more-modal {
  padding: 70px;
  height: 80vh;
  min-width: 70vw;
  border-radius: 5px;
  overflow-y: hidden;

  @media (max-width: 920px) {
    min-width: 100vw;
  }

  big {
    letter-spacing: 0.75px;
  }

  big.exit {
    margin-top: 12px;
    margin-right: 20px;
  }

  label {
    font-size: 0.9em;
    white-space: nowrap;
  }

  .select-group {
    width: 50%;
    float: left;

    p {
      font-size: 1em;
      margin-bottom: 0.5em;
    }

    label {
      margin-bottom: 10px;
    }

    .q-checkbox {
      height: 18px;
    }

    .q-checkbox input + div:before {
      width: 15px;
      height: 15px;
      border-radius: 4px;
      border: 1px solid $color-primary;
    }

    .q-checkbox input:checked + div:after {
      top: 3px;
      left: 2px;
      width: 4px;
      height: 8px;
      border-right: 1.5px solid #fff;
      border-bottom: 1.5px solid #fff;
    }
  }

  button {
    margin-left: 16px;
    margin-top: 20px;
    border-radius: 5px;
    clear: left;

    &.exit-reset{
      background: $color-secondary;

      &:hover {
        background: $color-secondary!important;
      }
    }
  }

  @media (max-width: 600px) {
    padding: 3.5vh 30px calc(3.5vh + 40px);

    .title {
      font-size: 20px;
    }

    .button-group {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;

      button {
        float: none;
        margin: 0;
        padding: 0;
        width: 50%;
        border-radius: 0;
        height: 40px;

      }
    }
  }

  .selection-row {
    height: 50vh;
     overflow-y: scroll;
     margin: 25px 0;

    .mobile & {
      height: 75vh;

      @media (min-width: 600px) {
        height: 50vh;
      }
    }
  }
}
</style>
