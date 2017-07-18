<template>
  <div class="postal-code-control">
    <div class="desktop-only">
      <div>
        <span>LOCATE ME</span>
        <span class="skip cursor-pointer" @click="reset"><u>clear</u></span>
      </div>
      <div class="postal-code-input text-white">
        <input
          :class="{'has-error': !validated}"
          v-model="value"
          placeholder="Enter Postal Code"
          @keyup.enter="onKeyEnter" />
        <div class="search-button cursor-pointer" @click="onKeyEnter">
          <img src='/assets/Locate_Me.svg'></img>
        </div>
      </div>
    </div>
    <div class="mobile-only">
      <q-fab
        classNames="text-white"
        activeIcon="clear"
        direction="right"
        ref="fab">
        <div class="q-popover">
          <div class= "postal-code-input-mobile text-white">
            <input
              :class="{'has-error': !validated}"
              v-model="value"
              placeholder="Enter Postal Code"
              @keyup.enter="onKeyEnter">
            </input>
            <div class="search-button cursor-pointer" @click="onKeyEnter">
              <img src='/assets/Locate_Me.svg'/>
            </div>
          </div>
        </div>
      </q-fab>
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
          .then(() => this.exportOptions())
          .then(query => this.$router.replace({query}))
        this.queryOnemap({postalCode: this.value})
      } else {
        this.reset()
      }
    }
  },
  mounted () {
    this.$watch('postalCode', function (value) {
      this.value = value
      if (value) this.$refs.fab.close()
      else this.$refs.fab.open()
    }, {immediate: true})
  }
}
</script>

<style lang="scss">
$color-primary: #273246;
$color-faded: #E8E8E8;


.postal-code-control {
  z-index: 10;
  margin-top: 15px;
  margin-left: 20px;

  .desktop-only {
    width: 280px;
  }

  span {
    font-size: 0.9rem;
    font-weight: 700;
    font-spacing: 0.75px;
    text-shadow:
      -1px -1px 0 white,
      1px -1px 0 white,
      -1px 1px 0 white,
      1px 1px 0 white;


    &.skip {
      float: right;
    }
  }

  .postal-code-input {
    background-color: $color-primary;
    border-radius: 5px;
    margin-top: 7px;
    width: 100%;

    input {
      border: 0;
      color: white;
      padding: 5px 15px;
      height: 40px;
      width: 220px;

      &::placeholder {
        color: white;
        font-style: italic;
      }
    }

    .search-button {
      width: 40px;
      height: 42px;
      background-color: $color-faded;
      border: 2px solid $color-primary;
      float: right;
      border-radius: 0 5px 5px 0;
      padding: 9px;
    }
  }

  .q-fab {
    width: inherit;

    button {
      border-radius: 5px;
      background-color: $color-primary;
      height: 42px;
      width: 40px;
      margin: 0;
      box-shadow: none;

      i {
        top: 10px;
        left: 10px;
        width: 20px;
        height: 20px;

        &.q-fab-icon {
          content: url("/assets/Locate Me_White.svg");
        }
      }
    }

    .backdrop {
      display: none;
    }

    .q-popover {
      top: 0;
      left: -20px;
      position: absolute;

      .postal-code-input-mobile {
        background-color: $color-primary;
        border-radius: 5px;
        width: 210px;

        input {
          border: 0;
          color: white;
          padding: 5px 15px;
          height: 40px;
          width: 170px;

          &::placeholder {
            color: white;
            font-style: italic;
          }
        }

        .search-button {
          width: 40px;
          height: 42px;
          background-color: $color-faded;
          border: 2px solid $color-primary;
          float: right;
          border-radius: 0 5px 5px 0;
          padding: 9px;
        }
      }
    }
  }
}
</style>
