<template>
  <div class="picker-map column">
    <div class="map-container auto" />
    <PostalCodeControl class="absolute-top-left" />
  </div>
</template>

<script>
import {Platform} from 'quasar-framework'
import {mapState, mapGetters} from 'vuex'
import {toSVY21} from 'sg-heatmap/dist/helpers/geometry'

import PostalCodeControl from './PostalCodeControl'

export default {
  name: 'MapView',
  props: {
    schoolId: String,
    hovered: String,
    selectedTab: String
  },
  computed: {
    ...mapState(['entityList', 'bookmarked', 'location']),
    ...mapState({
      schoolLevel: state => state.schoolLevel.selected,
      homeSchoolDistance: state => state.homeSchoolDistance}
    ),
    ...mapGetters(['filtered', 'suggested']),

    // Set styling of marker depending on settings
    visibleSchools () {
      const {oneKm, twoKm} = this.homeSchoolDistance
      const location = this.location && toSVY21(this.location)

      function getMarkerLabel (school) {
        if (location) {
          if (school.levelOfEducation.indexOf('P') > -1) {
            if (oneKm.indexOf(school.id) > -1) return 'within_1km'
            else if (twoKm.indexOf(school.id) > -1) return 'within_2km'
          } else {
            let distance = Math.sqrt(
              Math.pow(location[0] - school.svy21[0], 2) +
              Math.pow(location[1] - school.svy21[1], 2)
            )
            if (distance <= 1000) return 'within_1km'
            else if (distance <= 2000) return 'within_2km'
          }
        }
        return 'default'
      }

      return this.entityList.map(school => {
        // If a school is selected, highlight the school and provide school details
        if (school.id === this.schoolId) {
          return 'focused'
        } else if (this.selectedTab === '/bookmark') {
          if (this.bookmarked.indexOf(school.id) > -1) return 'bookmarked'
        } else {
          if (this.filtered.indexOf(school.id) > -1) {
            if (this.bookmarked.indexOf(school.id) > -1) return 'bookmarked'
            return getMarkerLabel(school)
          }
          if (this.suggested.indexOf(school.id) > -1) {
            if (this.bookmarked.indexOf(school.id) > -1) return 'bookmarked'
            return 'suggested'
          }
        }
        return null
      })
    }
  },
  mounted () {
    const mapSettings = {
      center: [1.352083, 103.819836],
      zoom: 13,
      minZoom: 11,
      maxZoom: 17,
      maxBounds: [[1.16, 103.582], [1.48073, 104.1647]],
      maxBoundsViscosity: 1.0
    }

    const markerTypes = {
      default: {
        color: 'rgb(241,126,89)',
        // shadow: '0px 0 0 10px rgba(241,126,89,0.5)',
        shadow: '0px 0 0 1px white',
        height: 15,
        zIndex: 0,
        displayName: 'Default',
        padding: ''
      },
      within_1km: {
        color: 'rgb(6,117,153)',
        shadow: '0px 0 0 10px rgba(6,117,153,0.5)',
        height: 15,
        zIndex: 300,
        displayName: 'Within 1 Km',
        padding: '0px'
      },
      within_2km: {
        color: 'rgb(92,208,253)',
        shadow: '0px 0 0 10px rgba(92,208,253,0.5)',
        height: 15,
        zIndex: 200,
        displayName: 'Within 2 Km',
        padding: '0px'
      },
      bookmarked: {
        color: 'rgba(61, 203, 181, 1)',
        shadow: '0px 0 0 5px rgba(61, 203, 181, 0.5)',
        height: 25,
        zIndex: 100,
        displayName: 'Bookmarked',
        padding: '10px'
      },
      focused: {
        color: 'rgb(247,177,70)',
        shadow: '0px 0 0 10px rgba(247,177,70,0.5)',
        height: 15,
        zIndex: 400,
        displayName: 'Focused',
        padding: '0px'
      },
      home: {
        color: 'rgb(27,45,72)',
        shadow: '0px 0 0 7px rgba(27,45,72,0.5)',
        height: 36,
        zIndex: 400,
        displayName: 'Home',
        padding: '10px'
      }
    }

    this.map = L.map(this.$el.children[0], mapSettings)

    // L.tileLayer('https://maps-{s}.onemap.sg/v3/Grey/{z}/{x}/{y}.png', {

    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
      keepBuffer: 9999999999,
      detectRetina: true,
      attribution: `
        <div class="desktop-only">
          <b>LEGEND</b>
          <span class="default"></span>Schools
          <span class="home"></span>Home
          <span class="within_1km"></span>Within 1km
          <span class="within_2km"></span>Between 1-2km
          <span class="bookmark"></span>Bookmarked
          <span class="selected"></span>Selected
        </div>
        &copy; <a href="//www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="//cartodb.com/attributions">CartoDB</a>
        `
      //   <img src="https://docs.onemap.sg/maps/images/oneMap64-01.png" class="onemap-attribution" />
      //   Map data © contributors, <a href="http://SLA.gov.sg">Singapore Land Authority</a>
      // `
    }).addTo(this.map)

    this.map.zoomControl.setPosition('topright')
    this.map.attributionControl.setPrefix('')

    const markers = this.entityList.map(school => {
      const [lng, lat] = school.coordinates
      return L.marker([lat, lng], {icon: L.divIcon()})
        .bindTooltip(school.name, {direction: 'top', offset: [0, -6]})
        .on('click', () => {
          if (Platform.is.mobile) this.$emit('hover', school.id)
          else this.$emit('focus', school.id)
        })
        .on('mouseover', () => {
          if (this.schoolId || Platform.is.mobile) return
          this.$emit('hover', school.id)
        })
        .on('mouseout', () => {
          if (this.schoolId || Platform.is.mobile) return
          this.$emit('hover', null)
        })
        .addTo(this.map)
    })

    // Map markers
    let homeMarker
    let visibleMarkers = []

    function fitBounds () {
      if (this.schoolId) return
      // const group = [...visibleMarkers]
      // if (homeMarker) group.push(homeMarker)
      // if (group.length > 0) this.map.fitBounds(L.featureGroup(group).getBounds())
      if (homeMarker) this.map.flyTo(homeMarker.getLatLng(), 13)
      else if (visibleMarkers.length > 0) this.map.fitBounds(L.featureGroup(visibleMarkers).getBounds())
    }

    this.$watch('visibleSchools', function (visible) {
      visibleMarkers = []
      markers.forEach((marker, i) => {
        const el = marker.getElement()
        if (visible[i]) {
          marker._icon.style.backgroundColor = markerTypes[visible[i]]['color']
          marker._icon.style.boxShadow = markerTypes[visible[i]]['shadow']
          marker._icon.style.padding = markerTypes[visible[i]]['padding']
          marker.setZIndexOffset(markerTypes[visible[i]]['zIndex'])
          marker._icon.style.backgroundImage = visible[i] === 'bookmarked' ? "url('/assets/Star_White.svg')" : null
          marker._icon.style.backgroundRepeat = visible[i] === 'bookmarked' ? 'no-repeat' : null
          marker._icon.style.backgroundSize = visible[i] === 'bookmarked' ? '13px' : null
          marker._icon.style.backgroundPosition = visible[i] === 'bookmarked' ? 'center' : null
          resizeMarker(marker, markerTypes, visible[i])

          el.classList.remove('hidden')
          visibleMarkers.push(marker)
        } else {
          el.classList.add('hidden')
        }
      })

      fitBounds.call(this)
    }, {immediate: true})

    this.$watch('hovered', function (hovered) {
      markers.forEach((marker, i) => {
        const isHovered = this.entityList[i].id === this.hovered
        if (isHovered) marker.openTooltip()
        else marker.closeTooltip()
      })
    }, {immediate: true})

    this.$watch('location', function (lnglat) {
      if (!lnglat) {
        if (homeMarker) {
          homeMarker.remove()
          homeMarker = null
        }
      } else {
        const [lng, lat] = lnglat
        if (homeMarker) {
          homeMarker.setLatLng([lat, lng])
        } else {
          const homeIcon = L.icon({
            iconUrl: '/assets/Home.svg',
            iconSize: [14, 14],
            iconAnchor: [8, 8]
          })

          homeMarker = L.marker([lat, lng], {icon: homeIcon, zIndexOffset: 400}).addTo(this.map)
          homeMarker._icon.style.backgroundColor = markerTypes['home']['color']
          homeMarker._icon.style.boxShadow = markerTypes['home']['shadow']
          homeMarker._icon.style.padding = markerTypes['home']['padding']
          resizeMarker(homeMarker, markerTypes, 'home')
        }
      }
      fitBounds.call(this)
    }, {immediate: true})

    this.$watch('schoolId', function (id) {
      if (id) {
        const [lng, lat] = this.entityList.filter(school => school.id === id)[0].coordinates
        this.map.flyTo([lat, lng], 15)
        this.$emit('hover', id)
      } else {
        this.$emit('hover', null)
      }
    }, {immediate: true})
  },
  components: {PostalCodeControl}
}

function resizeMarker (el, markerTypes, markerType) {
  el._icon.style.width = markerTypes[markerType]['height'] + 'px'
  el._icon.style.height = markerTypes[markerType]['height'] + 'px'
  el._icon.style.marginLeft = -(markerTypes[markerType]['height'] / 2) + 'px'
  el._icon.style.marginTop = -(markerTypes[markerType]['height'] / 2) + 'px'
}

</script>

<style lang="scss">
.picker-map {
  position: relative;

  .leaflet-marker-icon {
    border-radius: 50%;
    border: 0;

    &.hovered {
      z-index: 1000!important;
    }
  }

  .leaflet-pane,
  .leaflet-top,
  .leaflet-bottom {
    z-index: 0;
  }

  .leaflet-tooltip {
    opacity: 1!important;
    border-radius: 5px;
    font-weight: bold;
    color: inherit;
  }

  .leaflet-control-attribution {
    opacity: 1;
    background-color: white;
    padding: 15px;

    .onemap-attribution {
      width: 12px;
      height: 12px;
      margin-right: 5px;
    }

    .mobile & {
      height: 13px;
      font-size: 7px;
      padding: 2px;

      .onemap-attribution {
        width: 8px;
        height: 8px;
        margin-right: 3px;
      }
    }

    div {
      padding-bottom: 10px;
    }

    span {
      border-radius: 50%;
      width: 10px;
      height: 10px;
      display: inline-block;
      margin-right: 5px;
      margin-left: 7px;

      &:first-child {
        margin-left: 2px;
      }
      &.default {
        background-color: rgb(241,126,89);
      }
      &.home {
        background-color: rgb(27,45,72);
      }
      &.within_1km {
        background-color: rgb(6,117,153);
      }
      &.within_2km {
        background-color: rgb(92,208,253);
      }
      &.bookmark {
        background-color: rgb(61, 203, 181);
      }
      &.selected {
        background-color: rgb(247,177,70);
      }
    }
  }

  .leaflet-control-zoom {
    .mobile & {
      display: none;
    }
  }
}
</style>
