import range from 'lodash/range'
import fs from 'fs'
import {toSVY21} from 'sg-heatmap/dist/helpers/geometry'

import busStops from '../../data/busStops'
import schools from '../../data/locations'

import OSRM from 'osrm'
const osrm = new OSRM('data/osrm/singapore.osrm')

const coordinates = Object.keys(schools).map(code => schools[code].coordinates)
const sources = [coordinates.length]
const destinations = range(0, coordinates.length)

const busStopList = busStops
  .filter(busStop => busStop.Longitude && busStop.Latitude)
  .map(busStop => ({
    code: busStop.BusStopCode,
    coordinates: [busStop.Longitude, busStop.Latitude],
    svy21: toSVY21([busStop.Longitude, busStop.Latitude]).map(v => Math.round(v))
  }))

function queryTravelTime (busStop) {
  return new Promise((resolve, reject) => {
    const options = {
      coordinates: coordinates.concat([busStop.coordinates]),
      sources,
      destinations
    }
    osrm.table(options, (err, result) => {
      if (err) reject(err)
      const durations = result.durations[0]
      const travel = {}
      Object.keys(schools).forEach((code, i) => {
        travel[code] = durations[i]
      })
      const filename = 'public/data/travelTime/' + busStop.code + '.json'
      fs.writeFile(filename, JSON.stringify(travel), err => {
        if (err) reject(err)
        else resolve(filename)
      })
    })
  })
}

Promise.all(busStopList.map(queryTravelTime)).then(() => {
  fs.writeFileSync('public/busStopList.json', JSON.stringify(busStopList))
}).catch(err => {
  console.error(err)
})
