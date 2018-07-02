import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import pull from 'lodash/pull'
import uniq from 'lodash/uniq'

import {collectValues, optionsSelected} from 'helpers/util'

import * as modules from './modules'

const ROUTING_SERVER = process.env.NODE_ENV === 'production'
  ? process.env.ROUTING_SERVER_URL : 'http://localhost:5000'

import {
  getFiltered as filtered,
  getSuggested as suggested,
  importOptions,
  exportOptions
} from './controller'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    entityList: null,
    entityDetail: {},
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
    setEntityList (state, arr) {
      state.entityList = arr
    },
    addEntityDetail (state, obj) {
      Vue.set(state.entityDetail, obj.id, obj)
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
    fetchEntityList (context) {
      return axios.get(window.location.origin + '/data/entityList.json')
        .then(res => res.data)
        .then(json => {
          context.commit('setEntityList', json)
          return json
        })
    },
    fetchEntityDetail (context, id) {
      return axios.get('https://s3.ap-southeast-1.amazonaws.com/school-picker/' + id + '.json')
        .then(res => res.data)
        .then(json => {
          context.commit('addEntityDetail', json)
          return json
        })
    },
    fetchTravelTime (context, lnglat) {
      context.commit('setTravelTime', null)
      if (!lnglat) return
      const url = `${ROUTING_SERVER}/${process.env.VERSION}?coordinates=${lnglat.join(',')}`
      return axios.get(url)
        .then(res => res.data)
        .then(json => {
          context.commit('setTravelTime', json.result)
          return json
        })
        .catch(console.error)
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
      return axios.get(url)
        .then(res => res.data)
        .then(json => {
          if (json.results && json.results.length > 0) {
            const match = json.results[0]
            const lnglat = [+match.LONGITUDE, +match.LATITUDE]
            context.commit('setLocation', lnglat)
            context.dispatch('fetchTravelTime', lnglat)
            return match
          }
        }).catch(console.error)
    },
    importOptions,
    exportOptions
  },
  modules
})

export default store
