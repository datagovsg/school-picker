<template>
  <div class="card no-shadow">
    <div class="card-title cursor-pointer" @click="$emit('focus')">
      <div class="text-primary text-bold">{{info.name}}</div>
      <small class="text-primary">
        {{schoolType[0]}} &nbsp;&middot;&nbsp; {{schoolType[1]}}
      </small>
    </div>
    <div class="card-details" @click="$emit('focus')">
      <div class="unique-title text-negative text-italic" v-if="uniqueCcas.length > 0">
        Unique CCAs:
      </div>
      <div class="unique-content" v-if="uniqueCcas.length > 0">
        <span v-for="cca in uniqueCcas">
          <small class="cca-name">{{cca.name}}</small><small class="dot">&middot;</small>
        </span>
      </div>
    </div>

    <div class="card-actions">
      <span class="text-primary cursor-pointer action-details"
        @click="$emit('focus')">
        <small><img src="/assets/More_Details.svg"></img> Details</small>
      </span>
      <span class="cursor-pointer action-bookmark"
        :class="bookmarked ? 'text-bookmark' : 'text-primary'"
        @click="$emit('bookmark')">
        <small><img :src="bookmarked ? '/assets/Star_Green.svg' : '/assets/Star_Blue.svg'" />Bookmark
        <!-- {{bookmarked ? 'Bookmarked' : 'Bookmark'}} --></small>
      </span>
      <span v-if="travelTime" class="action-traveltime">
        <small class="text-primary"><img src='/assets/Car.svg'/>{{travelTime}}</small>
      </span>
      <span class="auto" />
    </div>
  </div>
</template>

<script>
import {capitalize} from 'helpers/text'

export default {
  props: {
    info: Object,
    bookmarked: Boolean
  },
  computed: {
    schoolType () {
      return Object.keys(this.info.schoolType).slice(0, 2).map(type => {
        type = type.split(' ').filter(term => term !== 'SCHOOL').join(' ')
        return capitalize(type)
      })
    },
    travelTime () {
      if ('travelTime' in this.info) {
        if (this.info.travelTime > 3600) return '> 1 HR'
        else return Math.ceil(this.info.travelTime / 60) + ' min'
      }
    },
    specialProgrammes () {
      const result = []
      const data = this.info['specialProgrammes']

      for (let key in data) {
        result.push({
          programmeGroup: key,
          programmeName: data[key],
          imgUrl: assets[key]
        })
      }

      return result
    },
    uniqueCcas () {
      return this.info['uniqueCcas']
    }
  }
}

const assets = {
  'Aesthetics': '/assets/Programmes/Aesthetics_VisualArt.svg',
  'Business & Entrepreneurship': '/assets/Programmes/Business_Innovation.svg',
  'Community & Youth Leadership': '/assets/Programmes/Leadership.svg',
  'Community Service & Student Leadership': '/assets/Programmes/Leadership.svg',
  'Humanities': '/assets/Programmes/Humanities_Languages.svg',
  'ICT': '/assets/Programmes/ICT.svg',
  'Innovation & Enterprise': '/assets/Programmes/Business_Innovation.svg',
  'Interdisciplinary': '/assets/Programmes/Interdisciplinary.svg',
  'Languages': '/assets/Programmes/Humanities_Languages.svg',
  'Languages & Humanities': '/assets/Programmes/Humanities_Languages.svg',
  'Mathematics': '/assets/Programmes/Mathematics.svg',
  'Mathematics & Innovation & Enterprise': '/assets/Programmes/Mathematics.svg',
  'Music & Performing Arts': '/assets/Programmes/PerformingArts.svg',
  'Music & Performing Arts / Visual Arts & Design': '/assets/Programmes/PerformingArts.svg',
  'STEM': '/assets/Programmes/Stem_Science.svg',
  'Science': '/assets/Programmes/Stem_Science.svg',
  'Science, ICT & Mathematics': '/assets/Programmes/Stem_Science.svg',
  'Sports & Outdoor Education': '/assets/Programmes/Sports.svg',
  'Visual Arts & Design': '/assets/Programmes/Aesthetics_VisualArt.svg'
}

</script>

<style lang="scss">
.picker-list-card {
  .card-title {
    font-size: 0.8em;
    padding-bottom: 5px;
    padding-top: 8px;

    small {
      font-size: 90%;
      font-weight: 400;
    }
  }

  .card-details {
    padding: 0 16px;

    .unique-title {
      font-size: 0.6em;
      padding-bottom: 5px;
    }

    .unique-content {
      font-size: 0.6em;
      padding-bottom: 16px;

      .cca-name {
        white-space: nowrap;
      }

      .dot {
        padding: 0 5px;
      }

      :last-child .dot {
        display: none;
      }
    }

    .special-programme {
      margin-top: -3px;

      .special-programme-icon {
        height: 10px;
        padding-right: 5px;
      }
    }
  }

  .card-actions {
    padding: 0;
    border-top: 0.5px solid rgba(128, 128, 128, 0.25);

    span {
      white-space: nowrap;
      padding: 5px;

      &.action-details {
        width: 26%;
        padding-left: 16px;
      }

      &.action-bookmark {
        width: 28%;
        padding-left: 10px;
      }

      &.action-traveltime {
        width: 27%;
        padding-left: 10px;
      }

      &.action-distance {
        width: 19%;
        text-align: center;
      }

      img {
        height: 12px;
        margin-right: 5px;
        vertical-align: middle;
        padding-bottom: 2px
      }
    }
  }
}
</style>
