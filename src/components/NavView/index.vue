<template>
  <div class="picker-nav toolbar" v-show="$route.path !== '/intro'">
    <a class="branding" href="/" @click="clearLocalStorage">
      <img src="/assets/SPBeta_Logo.svg">
    </a>

    <div class="actions">

      <a class="info-button" href="https://blog.data.gov.sg/find-the-right-school-using-our-new-school-picker-tool-3a7250b63390">i</a>

      <div class="bookmark-button desktop-only"
        :class="{'bg-positive': bookmarkActive, 'text-white': bookmarkActive}"
        @click="route">
        <img src="/assets/Star_White.svg" />BOOKMARK
        <span class="bookmark-indicator bg-positive" v-show="hasBookmark & !bookmarkActive" />
      </div>

      <div class="bookmark-toggle mobile-only"
        @click="route">
        <img :src="bookmarkActive ? '/assets/Star_Green_Solid.svg' : '/assets/Star_White.svg'" />
        <span class="bookmark-indicator bg-positive" v-show="hasBookmark & !bookmarkActive" />
      </div>

    </div>
  </div>
</template>

<script>
import {LocalStorage} from 'quasar-framework'

export default {
  props: {
    selectedTab: String,
    hasBookmark: Boolean
  },
  computed: {
    bookmarkActive () {
      return this.selectedTab === '/bookmark'
    }
  },
  methods: {
    route () {
      const path = this.selectedTab === '/explore' ? '/bookmark' : '/explore'
      this.$router.replace({path, query: this.$route.query})
      this.$emit('changeTab', path)
    },
    clearLocalStorage () {
      LocalStorage.remove('query')
    }
  }
}
</script>

<style lang="scss">
$color-positive: #30B19C;

.picker-nav {
  height: 70px;

  .branding {
    color: inherit;

    img {
      width: 270px;
      padding: 16px;
      vertical-align: middle;
    }
  }

  .info-button {
    display: inline-block;
    margin-right: 10px;
    width: 23px;
    height: 23px;
    border-radius: 50%;
    border: 1px solid white;
    color: white;
    font-weight: 700;
    text-align: center;
    vertical-align: middle;

    &:active,
    &:hover {
      color: white;
    }
  }

  .bookmark-button,
  .bookmark-toggle {
    display: inline-block;
    vertical-align: middle;
  }

  .mobile & {
    height: 30px;
    padding: 0 12px;

    .branding {
      img {
        padding: 5px 10px;
        width: 230px;
        margin-left: 0;
      }
    }

    .info-button {
      margin-right: 0;
    }
  }

  .bookmark-button {
    position: relative;
    margin-right: 7px;
    font-size: 0.8em;
    padding: 0.5em 1em;
    border: 1px solid $color-positive;
    border-radius: 4px;
    cursor: pointer;
    color: white;
    letter-spacing: 0.75px;
    font-weight: bold;

    img {
      height: 10px;
      margin-right: 5px;
    }
  }

  .filter-toggle,
  .bookmark-toggle {
    position: relative;
    font-size: 0.6em;
    padding: 5px;

    img {
      width: 20px;
    }
  }

  .bookmark-indicator {
    position: absolute;
    top: 3px;
    right: 6px;
    padding: 3px;
    border-radius: 50%;
    animation: 300ms ease-out 2 alternate blink;

    .mobile & {
      padding: 4px;
      top: 8px;
      right: 6px;
    }
  }

  @keyframes blink {
    to {
      transform: scale(1.5);
    }
  }
}
</style>
