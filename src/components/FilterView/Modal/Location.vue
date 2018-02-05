<template>
  <q-modal content-classes="filter-location-modal" @close="onClose">
    <big class="exit text-grey absolute-top-right cursor-pointer" @click="$children[0].close()"><i>clear</i></big>
    <big class="title text-primary text-bold">LOCATION</big>
    <div class="selection-row row wrap gutter">
      <div class="select-group sm-width-1of2 md-width-1of3 bg-width-1of3 lg-width-1of5"
        v-for="region in planningAreas">
        <p class="text-secondary text-bold">{{region.label}}</p>
        <div class="select-all">
          <label class="text-primary">
            <q-checkbox class="text-primary text-bold" :value="checked(region)" @input="select(region, $event)" />
            Select All
          </label>
        </div>
        <div class="select-one column">
          <label class="text-primary" v-for="area in region.areas">
            <q-checkbox :value="checked(area)" @input="select(area, $event)" />
            {{area.label}}
          </label>
        </div>
      </div>
    </div>
    <div class="button-group">
      <button class="exit-done primary float-right text-bold" @click="$children[0].close()">Done</button>
      <button class="exit-reset primary float-right text-bold" @click="resetAll()">Reset</button>
    </div>
  </q-modal>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex'

export default {
  computed: {
    ...mapState({
      planningAreas: state => state.planningAreas.options
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
    setDistance (val) {
      if (val !== this.distance) this.$store.commit('setDistance', val)
      else this.$store.commit('setDistance', null)
    },
    checked (options) {
      return this.optionsSelected({module: 'planningAreas', options})
    },
    select (options, toCheck) {
      if (toCheck) this.selectOptions({module: 'planningAreas', options})
      else this.unselectOptions({module: 'planningAreas', options})
    },
    resetAll () {
      this.resetOptions({module: 'planningAreas'})
    },
    onClose () {
      this.exportOptions().then(query => this.$router.push({query}))
    }
  }
}
</script>

<style lang="scss">
@import "~style/variables.scss";

.filter-location-modal {
  padding: 70px;
  min-height: 70vh;
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

  .row {
    label {
      font-size: 0.9em;
      white-space: nowrap;
      margin-bottom: 10px;
    }

    .select-group {
      padding: 0 16px 0 0;

      .q-checkbox {
        height: 18px;
      }

      .q-checkbox input + div:before {
        width: 15px;
        height: 15px;
        border-radius: 4px;
        border: 1px solid $color-primary;
      }

      p {
        font-size: 1em;
        margin-bottom: 1em;
      }
    }

    .select-one {
      .q-checkbox input:checked + div:after {
        top: 3px;
        left: 2px;
        width: 4px;
        height: 8px;
        border-right: 1.5px solid #fff;
        border-bottom: 1.5px solid #fff;
      }
    }

    .select-all {
      margin-bottom: 10px;

      label {
        font-weight: bold;
      }

      .q-checkbox input:checked + div:after {
        top: 7px;
        left: 4.5px;
        width: 6px;
        height: 0;
        border-bottom: 1px solid #fff;
        transform: none;
      }
    }
  }

  button {
    margin-top: 20px;
    margin-left: 16px;
    border-radius: 5px;
    letter-spacing: 0.75px;

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
