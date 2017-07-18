<template>
  <q-layout id="app" >
    <NavView slot="header"
      :selectedTab="selectedTab"
      :hasBookmark="bookmarked.length > 0"
      @changeTab="onChangeTab"
      @toggleDrawer="toggleDrawer" />
    <router-view slot="navigation" name="header" class="desktop-only"/>
    <router-view class="auto" ref="defaultView"
      :selectedTab="selectedTab"
      :hovered="hovered"
      @hover="onHover"
      @focus="onFocus" />
    <!-- <transition name="expand" mode="out-in" :duration="{leave: 0}"> -->
      <router-view name="aside"
        :selectedTab="selectedTab"
        :hovered="hovered"
        @hover="onHover"
        @bookmark="onBookmark"
        @focus="onFocus"
        @toggleDrawer="toggleDrawer" />
    <!-- </transition> -->
    <FilterViewMobile ref="drawer" class="mobile-only" />
  </q-layout>
</template>

<script>
import NavView from './NavView'
import {Mobile as FilterViewMobile} from './FilterView'

export default {
  data () {
    return {
      hovered: null,
      selectedTab: '/explore'
    }
  },
  computed: {
    bookmarked () {
      return this.$store.state.bookmarked
    }
  },
  methods: {
    onHover (id) {
      this.hovered = id
    },
    onBookmark (id) {
      const bookmarked = [...this.bookmarked]
      const index = bookmarked.indexOf(id)
      if (index > -1) bookmarked.splice(index, 1)
      else bookmarked.push(id)
      this.$store.commit('setBookmarked', bookmarked)
      this.$store.dispatch('exportOptions').then(query => this.$router.replace({query}))
    },
    onFocus (id) {
      if (this.$route.params.schoolId !== id) {
        this.$router.push({
          path: '/detail/' + id,
          query: this.$route.query
        })
      }
    },
    onChangeTab (tab) {
      this.selectedTab = tab
    },
    // onListResize () {
    //   if ('map' in this.$refs.defaultView) {
    //     this.$refs.defaultView.map.invalidateSize(true)
    //   }
    // },
    toggleDrawer () {
      this.$refs.drawer.$children[0].toggle()
    },
    closeMap () {
    }
  },
  components: {NavView, FilterViewMobile}
}
</script>

<style lang="scss">
html, body, #app {
  height: 100%;
  overflow: hidden;
}

.q-select-popover .item.active {
  background-color: inherit;
}

#app {
  .layout-content {
    flex-direction: row-reverse;

    .mobile & {
      flex-direction: column;
    }
  }

  .picker-list {
    flex: 0 0 450px;

    // &.expand-enter {
    //   flex-basis: 320px;
    // }
    //
    // &.expand-enter-active {
    //   transition: flex 300ms;
    // }

    .mobile & {
      flex: 1 1 auto;
      overflow-y: hidden;
      position: relative;
      z-index: 10;

      &.expanded {
        margin-top: -270px;
      }
    }

    transition: margin 150ms;
  }

  .picker-detail {
    flex: 0 0 450px;

    .mobile & {
      flex: 1 1 auto;
      overflow-y: auto;
      position: relative;
      z-index: 10;
      margin-top: -270px;

      &.expand-enter {
        margin-top: 0;
      }

      &.expand-enter-active {
        transition: margin 150ms;
      }
    }
  }

  .picker-map {
    .mobile & {
      flex: 0 0 270px;
    }
  }
}
</style>
