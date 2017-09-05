import fs from 'fs'
import isEmpty from 'lodash/isEmpty'
import omit from 'lodash/omit'
import {capitalize, acronym, standardFilter} from '../helpers/text'

const files = fs.readdirSync('data/raw').filter(file => file.match(/\.json$/))

// const ccas = require('../../data/ccas.json')
const locations = require('../../data/locations.json')
const specialNeeds = require('../../data/specialNeeds.json')
const studentCare = require('../../data/studentCare.json')
const vacancies = require('../../data/vacancies.json')

let mrtStations = require('nearest-mrt/data/processed/mrt_stations.json').data
mrtStations = Object.keys(mrtStations).map(name => name.replace(/ MRT STATION$/, ''))

const filteredYears = ['2014', '2015', '2016', '2017']

files.forEach(file => {
  try {
    const raw = require('../../data/raw/' + file)
    const processed = Object.assign({}, raw)
    processed.name = acronym(capitalize(raw.name, true), /^Chij/)
    processed.address = capitalize(standardFilter(raw.address), true)
    processed.mrt = cleanMRT(raw.mrt)
    processed.GeneralInformation = cleanGeneral(raw.GeneralInformation)
    processed.SubjectOffered = cleanSubjects(raw.SubjectOffered)
    processed.SpecialProgrammes = cleanSpecialProg(raw.SpecialProgrammes)
    // processed.Cca = ccas[raw.code]
    if ('PsleAggregateHistory' in raw) {
      processed['PsleAggregateHistory'] = cleanPSLE(raw['PsleAggregateHistory'])
    }
    if ('L1R5History' in raw) {
      processed['L1R5History'] = cleanL1R5(raw['L1R5History'])
    }
    for (let lvl in raw['AchievementHistory']) {
      const rawAchievement = raw['AchievementHistory'][lvl]
      processed['AchievementHistory'][lvl] = {
        'Sports & Games Competition': cleanSSSC(rawAchievement),
        'SYF': cleanSYF(rawAchievement),
        'Best Unit Award': cleanBUA(rawAchievement)
      }
      const toOmit = [
        'Sports & Games Competition',
        'SYF Central Judging',
        'SYF Arts Presentation',
        'Best Unit Award'
      ]
      filteredYears.forEach(year => {
        if (!(year in rawAchievement)) return
        const yearAchievement = omit(rawAchievement[year], toOmit)
        if (!isEmpty(yearAchievement)) {
          processed['AchievementHistory'][lvl][year] = yearAchievement
        }
      })
    }
    Object.assign(processed, locations[raw.code])
    if (raw.name in specialNeeds) processed.specialNeeds = specialNeeds[raw.name]
    if (raw.levels.indexOf('P') > -1) {
      processed.specialNeeds = processed.specialNeeds || []
      processed.specialNeeds.push('Mild SEN')
    }
    if (studentCare.indexOf(raw.name) > -1) processed.studentCare = true
    if (raw.name in vacancies) processed.p1Registration = vacancies[raw.name]
    processed.id = raw.code
    fs.writeFileSync('public/data/schools/' + file, JSON.stringify(processed, null, '\t'))
  } catch (err) {
    console.log('Bad record', file)
    throw err
  }
})

function cleanGeneral (input) {
  function batchCapitalize (input, splitOnDash = false) {
    if (input instanceof Array) return input.map(i => capitalize(i, splitOnDash))
    else return capitalize(input, splitOnDash)
  }

  function batchAcronym (input, ...patterns) {
    if (input instanceof Array) return input.map(i => acronym(i, ...patterns))
    else return acronym(input, ...patterns)
  }

  const fields = [
    {field: 'Principal', splitOnDash: true},
    {field: 'Vice Principal', splitOnDash: true},
    {field: 'Vice Principal (Admin)', splitOnDash: true},
    {field: 'Type of School', splitOnDash: false},
    {field: 'IP Partner Schools', splitOnDash: true, acronym: /^Chij/},
    {field: 'Affiliated Schools', splitOnDash: true, acronym: /^Chij/}
  ]

  const output = {...input}
  fields.forEach(f => {
    if (f.field in input) {
      output[f.field] = batchCapitalize(input[f.field], f.splitOnDash)
      if (f.acronym) output[f.field] = batchAcronym(output[f.field], f.acronym)
    }
  })
  return output
}

function cleanMRT (input) {
  input = input || ''
  return mrtStations
    .filter(name => input.toUpperCase().indexOf(name) > -1)
    .map(name => capitalize(name) + ' MRT')
}

function cleanSubjects (input) {
  const patterns = [
    /'o'/,
    /A\/c/,
    /N\(a\)$/,
    /N\(t\)$/,
    /\(Na\)$/,
    /\(Nt\)$/,
    /\(e\)$/,
    /\(S,g\)$/,
    /\(S,h\)$/,
    /\(S,l\)$/,
    /\(Ss,lc\)$/,
    /\(Ss,lm\)$/,
    /\(Ss,lt\)$/,
    /\(Mep\)$/,
    /\(Aep\)$/,
    / Mep$/,
    / Aep$/,
    /\(Gceo\)$/
  ]
  return input
    .map(s => capitalize(s, false))
    .map(s => acronym(s, ...patterns))
}

function cleanPSLE (input) {
  const rows = []
  filteredYears.forEach(year => {
    if (!(year in input)) return
    const yearCutoff = input[year]
    if (isEmpty(yearCutoff)) return
    const programmes = Object.keys(yearCutoff)
    programmes.forEach(programme => {
      const programmeCutoff = yearCutoff[programme]
      let lower, upper, lowerAffiliated, upperAffiliated
      if (programmeCutoff[0] === 'None-posted') {
        lower = upper = null
        if (programmeCutoff[1] === 'None-posted') {
          lowerAffiliated = upperAffiliated = null
        } else {
          lowerAffiliated = +programmeCutoff[1]
          upperAffiliated = +programmeCutoff[2]
        }
      } else {
        lower = +programmeCutoff[0]
        upper = +programmeCutoff[1]
        if (programmeCutoff[2] === 'None-posted') {
          lowerAffiliated = upperAffiliated = null
        } else {
          lowerAffiliated = +programmeCutoff[2]
          upperAffiliated = +programmeCutoff[3]
        }
      }
      rows.push({year, programme, lower, upper, lowerAffiliated, upperAffiliated})
    })
  })
  return rows
}

function cleanL1R5 (input) {
  const rows = []
  filteredYears.forEach(year => {
    if (!(year in input)) return
    const yearCutoff = input[year]
    if (isEmpty(yearCutoff)) return
    const programmes = Object.keys(yearCutoff)
    programmes.forEach(programme => {
      const [lower, upper] = yearCutoff[programme].map(v => v === '-' ? null : +v)
      rows.push({year, programme, lower, upper})
    })
  })
  return rows
}

function cleanSSSC (input) {
  const rows = []
  filteredYears.forEach(year => {
    if (!(year in input)) return
    const yearSSSC = input[year]['Sports & Games Competition']
    if (!yearSSSC) return

    const labels = yearSSSC[0].slice(1).map(c => [])
    yearSSSC.forEach(row => {
      const [first, ...rest] = row
      if (first === '') {
        rest.forEach((v, i) => {
          if (labels[i].length < 3) labels[i].push(v)
          else labels[i][2] = v
        })
      } else if (rest.length === labels.length) {
        rest.forEach((v, i) => {
          if (v === '-') return
          rows.push({
            year,
            category: first,
            subCategory: [...(labels[i])],
            award: v
          })
        })
      }
    })
  })
  return rows
}

function cleanSYF (input) {
  const rows = []
  filteredYears.forEach(year => {
    if (!(year in input)) return
    const yearSYF = input[year]['SYF Central Judging'] || input[year]['SYF Arts Presentation']
    if (!yearSYF) return
    const categories = Object.keys(yearSYF)
    categories.forEach(category => {
      rows.push({year, category, award: yearSYF[category]})
    })
  })
  return rows
}

function cleanBUA (input) {
  const rows = []
  filteredYears.forEach(year => {
    if (!(year in input)) return
    const yearBUA = input[year]['Best Unit Award']
    if (!yearBUA) return
    const categories = Object.keys(yearBUA)
    categories.forEach(category => {
      rows.push({
        year,
        category: acronym(category, /^Ncc/, /^Npcc/, /^Ncdcc/),
        award: yearBUA[category]
      })
    })
  })
  return rows
}

function cleanSpecialProg (input) {
  const output = Object.assign({}, input)
  if (input['MOE Programmes'][0] === 'Not Available') {
    delete output['MOE Programmes']
  } else {
    output['MOE Programmes'] = input['MOE Programmes']
      .map(v => v.toUpperCase() === v ? capitalize(v) : v)
      .map(v => acronym(v, /^Sap/))
  }
  return output
}
