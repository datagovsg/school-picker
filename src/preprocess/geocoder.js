import fs from 'fs'
import fetch from 'node-fetch'
import {fromSVY21} from 'sg-heatmap/dist/helpers/geometry'
import {CustomHeatmap} from '../helpers/geospatial'
import {onemapApi} from '../helpers/api'

// geocode()
// getPrimarySchoolLocations()
// getPlanningArea()

export function geocode () {
  const filenames = fs.readdirSync('data/raw')
    .filter(file => file.match(/\.json$/))

  const apiCalls = {
    delay: 50,
    queue: Promise.resolve(),
    push (url) {
      this.queue = this.queue.then(() => {
        return new Promise((resolve, reject) => {
          setTimeout(resolve, this.delay, fetch(url))
        })
      })
      return this.queue
    }
  }

  const locations = {}

  Promise.all(filenames.map(filename => {
    let school = require('../../data/raw/' + filename)
    const searchVal = 'https://developers.onemap.sg/commonapi/search?searchVal=' +
      school.postalCode + '&returnGeom=Y&getAddrDetails=Y&pageNum=1'
    return apiCalls.push(searchVal)
      .then(res => res.json())
      .then(json => {
        const match = json.results.find(address =>
          normalize(school.name) === normalize(address.BUILDING))
        if (match) {
          locations[school.code] = {
            coordinates: [+match.LONGITUDE, +match.LATITUDE],
            svy21: [+match.X, +match.Y]
          }
        } else {
          console.log('Not found:', filename)
        }
      })
      .catch(console.error)
  })).then(() => {
    fs.writeFileSync('data/locations.json', JSON.stringify(locations, null, '\t'))
  })
}

function normalize (str) {
  return str.toLowerCase()
    .replace(/saint/g, 'st.')
    .replace(/government/g, 'govt.')
}

export function getPrimarySchoolLocations () {
  function fetchSchools (token) {
    const url = 'https://www.onemap.sg/schooldataAPI/Services.svc/searchSchools?token=' + token
    return fetch(url).then(res => res.json()).then(json => {
      if (!('SearchResults' in json)) throw new Error()
      return json.SearchResults.slice(1)
    })
  }

  onemapApi(fetchSchools).then(data => {
    const locations = require('../../data/locations.json')
    const schoolList = require('../../data/schoolList.json')

    data.forEach(location => {
      const match = schoolList.find(school => school.name === location.SCHOOLNAME)
      if (!match) return
      let [lng, lat] = fromSVY21([+location.SCH_X_ADDR, +location.SCH_Y_ADDR])
      lng = +(lng.toString().slice(0, 13))
      lat = +(lat.toString().slice(0, 13))
      const svy21 = [+location.SCH_X_ADDR, +location.SCH_Y_ADDR]
      Object.assign(locations[match.code], {coordinates: [lng, lat], svy21})
    })

    fs.writeFileSync('data/locations.json', JSON.stringify(locations))
  }).catch(console.error)
}

export function getPlanningArea () {
  const locations = require('../../data/locations.json')
  const heatmap = new CustomHeatmap()

  Object.keys(locations).forEach(school => {
    const matches = heatmap.bin(locations[school].coordinates)
    locations[school].planningArea = matches[0].id
    locations[school].neighbours = matches[0].properties.neighbours
  })

  fs.writeFileSync('data/locations.json', JSON.stringify(locations))
}
