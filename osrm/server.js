const path = require('path')
const express = require('express')
const OSRM = require('osrm')

const app = express()
const osrm = new OSRM(path.join(__dirname, 'config/singapore.osrm'))

const data = {
  school: require('./data/school.json'),
  childcare: require('./data/childcare.json')
}

const optionsGetter = transformSet(data, getOptions)
const resultFormatter = transformSet(data, formatResult)

app.get('/:client', function (req, res) {
  if (!(req.params.client in data)) {
    res.sendStatus(404)
    return
  }

  const location = validateCoordinates(req.query)
  const options = optionsGetter[req.params.client](location)

  osrm.table(options, (err, result) => {
    if (err) return res.sendStatus(500)
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Cache-Control', 'public, max-age=86400')
    res.json({query: req.query, result: resultFormatter[req.params.client](result)})
  })
})

const port = process.env.PORT || 5000
app.listen(port)
console.log('Listening at:', port)

function validateCoordinates (query) {
  if (!('coordinates' in query)) {
    throw new Error('Validation error: query missing coordinates')
  }
  const coordinates = query.coordinates.split(',').map(v => +v)
  if (coordinates.length < 2 || coordinates.some(isNaN)) {
    throw new Error('Validation error: Invalid coordinates')
  }

  return coordinates
}

function getOptions (data) {
  const coordinates = Object.keys(data).map(id => data[id].coordinates)
  const sources = [coordinates.length]
  const destinations = []
  for (let i = 0; i < coordinates.length; i++) {
    destinations.push(i)
  }

  return (location) => {
    return {
      coordinates: coordinates.concat([location]),
      sources,
      destinations
    }
  }
}

function formatResult (data) {
  return (result) => {
    const durations = result.durations[0]
    const travelTime = {}
    Object.keys(data).forEach((id, i) => {
      travelTime[id] = durations[i]
    })
    return travelTime
  }
}

function transformSet (data, transform) {
  const transformed = {}
  Object.keys(data).forEach(key => {
    transformed[key] = transform(data[key])
  })
  return transformed
}
