import Vue from 'vue'
import Vuex from 'vuex'
import pull from 'lodash/pull'
import uniq from 'lodash/uniq'

// import {toSVY21} from 'sg-heatmap/dist/helpers/geometry'
import {collectValues, optionsSelected} from 'helpers/util'

import * as modules from './modules'

const ROUTING_SERVER = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000/school'

import {
  getFiltered as filtered,
  getSuggested as suggested,
  importOptions,
  exportOptions
} from './controller'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    schoolList: null,
    schoolDetail: {},
    travelTime: null,
    bookmarked: [],
    postalCode: null,
    location: null
  },
  getters: {
    filtered,
    suggested,
    optionsSelected (state, getters) {
      return ({module, options}) => {
        return optionsSelected(options, state[module].selected)
      }
    }
  },
  mutations: {
    setSchoolList (state, arr) {
      state.schoolList = arr
    },
    addSchoolDetail (state, obj) {
      Vue.set(state.schoolDetail, obj.id, obj)
    },
    setTravelTime (state, obj) {
      state.travelTime = obj
    },
    setBookmarked (state, arr) {
      state.bookmarked = arr
    },
    setPostalCode (state, str) {
      state.postalCode = str
    },
    setLocation (state, lnglat) {
      state.location = lnglat
    },
    updateSelected (state, {module, updated}) {
      state[module].selected = updated
    }
  },
  actions: {
    fetchSchoolList (context) {
      return window.fetch(window.location.origin + '/schoolList.json')
        .then(res => res.json())
        .then(json => {
          context.commit('setSchoolList', json)
          return json
        })
    },
    fetchSchoolDetail (context, id) {
      return window.fetch(window.location.origin + '/data/schools/' + id + '.json')
        .then(res => res.json())
        .then(json => {
          context.commit('addSchoolDetail', json)
          return json
        })
    },
    fetchTravelTime (context, lnglat) {
      context.commit('setTravelTime', null)
      if (!lnglat) return
      // const url = window.location.origin + '/travel-time?location=' + toSVY21(lnglat).join(',')
      const url = ROUTING_SERVER + '/school?coordinates=' + lnglat.join(',')
      return window.fetch(url)
        .then(res => res.json())
        .then(json => {
          context.commit('setTravelTime', json.result)
          return json
        })
        .catch(err => {
          console.error(err)
        })
    },
    selectOptions (context, {module, options}) {
      const updated = uniq([
        ...context.state[module].selected,
        ...collectValues(options)
      ])
      context.commit('updateSelected', {module, updated})
    },
    unselectOptions (context, {module, options}) {
      const updated = [...context.state[module].selected]
      pull(updated, ...collectValues(options))
      context.commit('updateSelected', {module, updated})
    },
    resetOptions (context, {module}) {
      context.commit('updateSelected', {module, updated: []})
    },
    locateAddress (context, postalCode) {
      context.commit('setPostalCode', postalCode)
      context.commit('setLocation', null)
      const url = 'https://developers.onemap.sg/commonapi/search?searchVal=' + postalCode + '&returnGeom=Y&getAddrDetails=Y'
      return window.fetch(url)
        .then(res => res.json())
        .then(json => {
          if (json.results && json.results.length > 0) {
            const match = json.results[0]
            const lnglat = [+match.LONGITUDE, +match.LATITUDE]
            context.commit('setLocation', lnglat)
            context.dispatch('fetchTravelTime', lnglat)
            return match
          }
        }).catch(err => {
          console.error(err)
        })
    },
    importOptions,
    exportOptions
  },
  modules
})

export default store
