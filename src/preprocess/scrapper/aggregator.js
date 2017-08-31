import fs from 'fs'
import scrap from './scrapper'

const levelNames = {
  'P': 'Primary',
  'S': 'Secondary',
  'J': 'Junior College'
}

export default async function aggregate (base, years) {
  const json = Object.assign({}, base)
  Object.assign(json, await scrap(null, {schoolCode: base.code}))
  json['GeneralInformation'] = await scrap('GeneralInformation', {schoolCode: base.code})
  json['SubjectOffered'] = await scrap('SubjectOffered', {schoolCode: base.code})
  json['Cca'] = await scrap('Cca', {schoolCode: base.code})
  json['SpecialProgrammes'] = await scrap('SpecialProgrammes', {schoolCode: base.code})
  json['AchievementHistory'] = {}
  for (let lvl of base.levels.split('')) {
    if (!(lvl in levelNames)) continue
    json['AchievementHistory'][levelNames[lvl]] = await Promise.all(
      years.map(y => scrap('AchievementHistory', {schoolCode: base.code, schoolLevel: lvl, awardYear: y}))
    ).then(arr => arr.reduce((j, v, i) => Object.assign(j, {[years[i]]: v}), {}))
  }
  if (base.levels.indexOf('S') > -1) {
    json['PsleAggregateHistory'] = await Promise.all(
      years.map(y => scrap('PsleAggregateHistory', {schoolCode: base.code, schoolLevel: 'S', yearOfSec1: y}))
    ).then(arr => arr.reduce((j, v, i) => Object.assign(j, {[years[i]]: v}), {}))
  }
  if (base.levels.indexOf('J') > -1) {
    json['L1R5History'] = await Promise.all(
      years.map(y => scrap('L1R5History', {schoolCode: base.code, schoolLevel: 'J', l1r5Year: y}))
    ).then(arr => arr.reduce((j, v, i) => Object.assign(j, {[years[i]]: v}), {}))
  }
  if (json.address) {
    const postalCode = json.address.match(/\( (\d{6}) \)$/)
    json.postalCode = postalCode && postalCode[1]
  }
  fs.writeFileSync(`data/raw2/${base.code}.json`, JSON.stringify(json, null, '\t'))
}
