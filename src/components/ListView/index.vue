<template>
  <div class="picker-list bg-secondary column"
    :class="{expanded: expanded}">
    <div class="sort-by desktop-only item multiple-lines">
      <div class="item-content">
        <span>SORT BY</span>
        <q-select class="full-width list-select"
          v-model="sortBy.value"
          :options="sortBy.options"
          :disable="!location || !travelTime" />
      </div>
    </div>
    <div class="span-group">
      <span class="match-count text-primary">
        {{matchCount}}
      </span>
      <span class="button map mobile-only cursor-pointer bg-primary text-white text-bold"
        @click="expanded = !expanded">
        <img :src="expanded ? '/assets/Map_White.svg' : '/assets/List_White.svg'"/>
        <small>{{expanded ? 'MAP' : 'LIST'}}</small>
      </span>
      <span class="button filter mobile-only cursor-pointer bg-primary text-white text-bold"
        @click="toggleDrawer">
        <img src="/assets/Filter_White.svg"/><small>FILTER</small>
      </span>
    </div>
    <!-- <transition-group tag="div" class="picker-list-cards" name="list"> -->
    <div class="picker-list-cards" ref="cards">
      <ListCard class="picker-list-card"
        v-for="card in renderedCards" :key="card.id"
        :class="{hovered: isHovered(card.id)}"
        :info="card"
        :bookmarked="isBookmarked(card.id)"
        @mouseover.native="onHover(card.id)"
        @mouseleave.native="onHover(null)"
        @bookmark="$emit('bookmark', card.id)"
        @focus="$emit('focus', card.id)" />
    </div>
    <!-- </transition-group> -->
  </div>
</template>

<script>
import {Platform} from 'quasar-framework'
import {mapState, mapGetters} from 'vuex'
import sortBy from 'lodash/sortBy'
import {toSVY21} from 'sg-heatmap/dist/helpers/geometry'

import CardForPrimary from './CardForPrimary'
import CardForPreschool from './CardForPreschool'
import SearchBox from '../FilterView/TabsForPrimary/SearchBox'

const ListCard = process.env.VERSION === 'preschool' ? CardForPreschool : CardForPrimary

export default {
  props: {
    hovered: String
  },
  data () {
    return {
      expanded: false,
      sortBy: {
        options: [
          {label: 'A to Z', value: 'alphabet'},
          {label: 'Distance', value: 'distance'},
          {label: 'Travel time', value: 'travelTime'}
        ],
        value: 'alphabet'
      }
    }
  },
  computed: {
    ...mapState(['schoolList', 'travelTime', 'bookmarked', 'location']),
    ...mapState({
      homeSchoolDistance: state => state.homeSchoolDistance}
    ),
    ...mapGetters(['filtered', 'suggested']),
    renderedCards () {
      const cards = this.$route.path === '/bookmark'
        ? this.bookmarked : [...this.filtered, ...this.suggested]
      let filtered = this.schoolList
        .filter(school => cards.indexOf(school.id) > -1)

      if (this.location) {
        const location = toSVY21(this.location)
        filtered = filtered.map(school => {
          const distance = Math.sqrt(
            Math.pow(location[0] - school.svy21[0], 2) +
            Math.pow(location[1] - school.svy21[1], 2)
          )
          return Object.assign({distance}, school)
        })
      }

      if (this.travelTime) {
        filtered = filtered.map(school =>
          Object.assign({travelTime: this.travelTime[school.id]}, school))
      }

      return sortBy(filtered, this.sortBy.value === 'alphabet' ? 'name' : this.sortBy.value)
    },
    matchCount () {
      if (this.$route.path === '/explore') {
        if (this.renderedCards.length > 1) {
          return this.renderedCards.length + ' schools match your criteria'
        } else if (this.renderedCards.length > 0) {
          return '1 school match your criteria'
        } else {
          return 'No match'
        }
      } else if (this.$route.path === '/bookmark') {
        if (this.renderedCards.length > 1) {
          return this.renderedCards.length + ' schools bookmarked'
        } else if (this.renderedCards.length > 0) {
          return '1 school bookmarked'
        } else {
          return 'Nothing bookmarked'
        }
      }
    }
  },
  methods: {
    isBookmarked (id) {
      return this.bookmarked.indexOf(id) > -1
    },
    isHovered (id) {
      return id === this.hovered
    },
    route (endpoint) {
      return {path: endpoint, query: this.$route.query}
    },
    onHover (id) {
      if (!Platform.is.mobile) this.$emit('hover', id)
    },
    toggleDrawer () {
      this.$emit('toggleDrawer')
    }
  },
  mounted () {
    if (this.location) this.sortBy.value = 'distance'
  },
  watch: {
    location (loc) {
      if (loc) this.sortBy.value = 'distance'
      else this.sortBy.value = 'alphabet'
    },
    hovered (id) {
      if (id && Platform.is.mobile) {
        let offset = 0
        let index = 0
        while (this.renderedCards[index].id !== id) {
          const rect = this.$refs.cards.children[index].getBoundingClientRect()
          offset += rect.bottom - rect.top + 10
          index++
        }
        this.$refs.cards.scrollTop = offset
      }
    }
  },
  components: {ListCard, SearchBox}
}
</script>

<style lang="scss">
$color-primary: #273246;
$color-secondary: #F8BD36;

.picker-list {
  position: relative;
  z-index: 20;
  padding: 10px 22px 0;
  overflow-x: hidden;

  .picker-searchbox + img {
    height: 40px;
    margin: 10px 12px;
    padding: 12px;
    transition: transform 500ms;
  }

  .span-group {
    white-space: nowrap;

    .match-count {
      font-size: 0.9em;
      font-weight: bold;
      display: inline-block;
      white-space: initial;

      .mobile & {
        width: calc(100% - 190px)
      }
    }

    span {
      display: inline-block;
    }

    .button {
      top: 10px;
      height: 30px;
      padding: 4px 10px;
      margin-left: 10px;

      display: inline-block;
      text-align: center;
      vertical-align: middle;
      border-radius: 5px;
      float: right;

      small {
        font-size: 12px;
        letter-spacing: 0.75px;
      }

      img {
        height: 10px;
        padding: 0 5px 0 0;
      }
    }
  }

  .sort-by {
    .item-content{
      padding: 10px 0 0;
      margin-left: 0;
      margin-right: 0;
      position: relative;

      span {
        font-size: 12.8px;
        font-spacing: 0.75px;
        display: block;
        padding-bottom: 10px;
        font-weight: 700;
      }

      .q-picker-textfield {
        position: relative;
        border: 2px solid $color-primary!important;
        border-radius: 5px;
        z-index: 20;
        padding: 10px;

        &.disabled {
          opacity: 1!important;
        }

        &.q-picker-textfield::after {
          height: 100%;
          width: 40px;
          top: 0;
          text-align: center;
          transform: none!important;
          border: 1px solid $color-primary;
          background-color: $color-primary;
          padding: 8px 14px 0;
          content: url('/assets/Dropdown_White.svg');
        }
      }
    }
  }


  .picker-list-cards {
    padding-top: 0;
    padding-bottom: 15px;
    padding-right: 6px;
    margin-right: -6px;
    margin-top: 15px;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .picker-list-card {
    position: relative;
    background-color: white;
    margin-bottom: 10px;
    border-radius: 5px;
    transition: transform 200ms;

    &:last-child {
      margin-bottom: 0;
    }

    &.hovered {
      transform: translateX(6px);
    }
  }

  // .list-move {
  //   transition: transform 500ms;
  // }
}

.q-popover {
  border-radius: 5px;
  background: $color-primary;

  .item {
    color: white;
    font-size: 0.9rem;

    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }

    &:hover {
      color: $color-secondary!important;
    }

    i {
      display: none;
    }
  }

  .q-select-popover {
    border: 0;
    background: $color-primary;

    .item {
      color: white;
      border-bottom: 1px solid black;

      &:last-child {
        border-bottom: 0;
      }

      &:hover {
        color: $color-secondary;
      }
    }
  }
}

</style>
