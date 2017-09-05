import fs from 'fs'
import _range from 'lodash/range'
import _max from 'lodash/max'
import scrap from './scrapper'
import aggregate from './aggregator'
import runTask from './task-runner'
import {
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

// scrapRelocatedSchools().then(json => {
//   fs.writeFileSync('data/relocatedSchools.json', JSON.stringify(json, null, '\t'))
// })

// scrapMergerSchools().then(json => {
//   fs.writeFileSync('data/mergerSchools.json', JSON.stringify(json, null, '\t'))
// })

// scrapNewSchools().then(json => {
//   fs.writeFileSync('data/newSchools.json', JSON.stringify(json, null, '\t'))
// })

// scrapVacancies().then(json => {
//   const vacancies = require('../../../data/vacancies.json')
//   Object.keys(json).forEach(key => {
//     if (key in vacancies) Object.assign(vacancies[key], json[key])
//     else vacancies[key] = json[key]
//   })
//   Object.keys(vacancies).forEach(key => {
//     const school = vacancies[key]
//     if ('No. of Children Registered' in school) {
//       const phases = Object.keys(school).filter(key => key.match(/^Vacancy for/)).map(key => key.slice(12))
//       school['No. of Applicants in ' + _max(phases)] = school['No. of Children Registered']
//       delete school['No. of Children Registered']
//     }
//   })
//   const now = new Date()
//   now.setHours(now.getHours() + 8)
//   const suffix = '_' + now.toISOString().slice(0, 10)
//   fs.writeFileSync('data/vacancies.json', JSON.stringify(vacancies, null, '\t'))
//   fs.writeFileSync(`data/backups/vacancies${suffix}.json`, JSON.stringify(vacancies, null, '\t'))
// })

runTask([], defaultYearRange)
