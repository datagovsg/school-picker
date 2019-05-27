import fs from 'fs'
import _range from 'lodash/range'
import _max from 'lodash/max'
import scrap from './scrapper'
import aggregate from './aggregator'
import runTask from './task-runner'
import {
  scrapSpecialNeeds,
  scrapRelocatedSchools,
  scrapMergerSchools,
  scrapNewSchools,
  scrapStudentCare,
  scrapVacancies
} from './additionalScrappers'

import {defaultYearRange} from './constants'

// scrap('', {schoolCode: '1759'})
//   .then(json => {
//     fs.writeFileSync('data/tmp.json', JSON.stringify(json, null, '\t'))
//   })

// scrapSpecialNeeds().then(json => {
//   fs.writeFileSync('data/specialNeeds.json', JSON.stringify(json, null, '\t'))
// })

// scrapStudentCare().then(json => {
//   fs.writeFileSync('data/studentCare.json', JSON.stringify(json, null, '\t'))
// })

scrapVacancies().then(json => {
  const vacancies = require('../../../data/vacancies.json')
  Object.keys(json).forEach(key => {
    if (key in vacancies) Object.assign(vacancies[key], json[key])
    else vacancies[key] = json[key]
  })
  Object.keys(vacancies).forEach(key => {
    const school = vacancies[key]
    if ('NO. OF CHILDREN REGISTERED' in school) {
      const phases = Object.keys(school).filter(key => key.match(/^VACANCY FOR/)).map(key => key.slice(12))
      school['NO. OF APPLICANTS IN ' + _max(phases)] = school['NO. OF CHILDREN REGISTERED']
      delete school['NO. OF CHILDREN REGISTERED']
    }
  })
  const now = new Date()
  now.setHours(now.getHours() + 8)
  const suffix = '_' + now.toISOString().slice(0, 10)
  fs.writeFileSync('data/vacancies.json', JSON.stringify(vacancies, null, '\t'))
  fs.writeFileSync(`data/backups/vacancies${suffix}.json`, JSON.stringify(vacancies, null, '\t'))
})

// runTask([], defaultYearRange)
