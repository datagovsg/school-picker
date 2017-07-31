<template>
  <div class="picker-searchbox item multiple-lines bg-secondary">
    <div class="item-content">
      <strong><small class="item-title text-black">SEARCH</small></strong>
      <q-autocomplete
        v-model="searchVal"
        @search="search"
        @selected="selected"
        :min-characters="2"
        :delay="0"
        delimiter>
        <q-search @click.native="toggleDrawer" v-model="searchVal" placeholder="Find a school" />
      </q-autocomplete>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  data () {
    return {
      searchVal: ''
    }
  },
  computed: {
    ...mapState({
      schoolList: state => state.schoolList,
      schoolLevel: state => state.schoolLevel.selected
    })
  },
  methods: {
    search (value, done) {
      const filtered = this.schoolList.filter(school => {
        return !this.schoolLevel || school.levelOfEducation.indexOf(this.schoolLevel) > -1
      }).filter(school => {
        const terms = school.name.split(' ').map((v, i, arr) => {
          return arr.slice(i).join(' ')
        })
        const pattern = new RegExp('^' + value, 'i')

        return terms.some(term => {
          if (term.match(/^(SCHOOL|PRIMARY|SECONDARY|HIGH)$/)) return false
          return terms.some(term => term.match(pattern))
        })
      }).map(school => ({
        label: school.name,
        value: school.name,
        icon: 'school',
        id: school.id
      }))
      done(filtered)
    },
    selected (item) {
      this.$router.push({
        path: '/detail/' + item.id,
        query: this.$route.query
      })
      this.searchVal = ''
    },
    toggleDrawer () {
      this.$emit('toggleDrawer')
    }
  }
}
</script>

<style lang="scss">
$color-secondary-darker: #F5AE31;
$color-searchbox: #EF9328;

.picker-searchbox {
  background-color: $color-secondary-darker!important;

  .item-content {
    border: 1px solid $color-secondary-darker;
    padding-left: 22px;
    padding-right: 22px;
    margin-left: 0;
    margin-right: 0;
  }

  .q-search {
    .q-search-input-container {
      position: relative;
      color: white;

      .q-search-input {
        height: 40px;
        overflow: hidden;
        text-overflow: ellipsis;
        box-shadow: none;
        border-radius: 5px;
        background-color: $color-searchbox;
        font-size: 0.9rem;
      }

      input::placeholder{
        font-style: italic;
        color: white;
      }
    }
  }
}

.q-popover .item-primary ~ .item-content {
    margin-left: 1em;
    font-size: 1em;
}
</style>
