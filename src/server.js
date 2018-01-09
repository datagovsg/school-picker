import express from 'express'
import compression from 'compression'
import fetch from 'node-fetch'
import querystring from 'querystring'
import path from 'path'
import fallback from 'express-history-api-fallback'

import {onemapApi} from './helpers/api'

import schoolList from '../public/schoolList'

const app = express()

const root = path.join(__dirname, '../public')

if (process.env.NODE_ENV === 'production') app.use(compression())

app.use(express.static(root))

app.get('/nearby-school', function (req, res) {
  function getNearbySchools (token) {
    const query = Object.assign({token}, req.query)
    const url = 'https://developers.onemap.sg/publicapi/schooldataAPI/querySchools?' + querystring.stringify(query)
    return fetch(url)
      .then(res => res.json())
      .then(json => {
        if (json.error) throw new Error(json.error)
        const results = json.SearchResults
        const oneKm = []
        const twoKm = []
        results.forEach(match => {
          if (!match.SCHOOLNAME) return
          const school = schoolList.find(row => row.name.toUpperCase() === match.SCHOOLNAME.toUpperCase())
          if (school) {
            if (match.DIST_CODE === '1') oneKm.push(school.id)
            else if (match.DIST_CODE === '2') twoKm.push(school.id)
          }
        })
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Cache-Control', 'public, max-age=3600')
        res.json({query: req.query, result: {oneKm, twoKm}})
      })
  }
  onemapApi(getNearbySchools).catch(err => {
    console.error(err)
    res.sendStatus(500)
  })
})

app.use(fallback('index.html', {root}))

const port = process.env.PORT || 8080
app.listen(port)
console.log('Listening at:', port)
