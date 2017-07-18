import _uniqBy from 'lodash/uniqBy'
import _maxBy from 'lodash/maxBy'

import {exponentialSmoothing} from '../helpers/search'
import {standardFilter, synonym} from '../helpers/text'

import ccaMapping from '../../data/ccaMapping.json'
import ccaFrequency from '../../data/tokens/ccas.json'

export default {
  name (json) {
    return json.name
  },

  website (json) {
    return json.website
  },

  email (json) {
    return json.email.toLowerCase()
  },

  coordinates (json) {
    return json.coordinates
  },

  svy21 (json) {
    return json.svy21
  },

  planningArea (json) {
    return json.planningArea
  },

  neighbouringPA (json) {
    return json.neighbours
  },

  nearestMrt (json) {
    const result = {}
    json.mrt.forEach(token => {
      result[token] = 1
    })
    return result
  },

  cluster (json) {
    return json.cluster
  },

  levelOfEducation (json) {
    return json.levels
  },

  coEdSchool (json) {
    const types = this.schoolType(json)
    if ("BOYS' SCHOOL" in types) return "BOYS' SCHOOL"
    if ("GIRLS' SCHOOL" in types) return "GIRLS' SCHOOL"
    return 'CO-ED SCHOOL'
  },

  singleSession (json) {
    return !('DOUBLE SESSION' in this.schoolType(json))
  },

  specializedSchool (json) {
    const types = this.schoolType(json)
    if ('SPECIALISED SCHOOL' in types) return true
    if ('SPECIALISED INDEPENDENT SCHOOL' in types) return true
    return false
  },

  independentSchool (json) {
    const types = this.schoolType(json)
    if ('INDEPENDENT SCHOOL' in types) return true
    if ('SPECIALISED INDEPENDENT SCHOOL' in types) return true
    return false
  },

  autonomousSchool (json) {
    return 'Autonomous' in this.schoolType(json)
  },

  sapSchool (json) {
    return 'SAP' in this.specialMoeProgrammes(json)
  },

  ip (json) {
    const programmes = this.specialMoeProgrammes(json)
    if ('Integrated Programme' in programmes) return true
    if ('Integrated Programme - Dual Track School (offers both IP and O Levels)' in programmes) return true
    return false
  },

  gep (json) {
    return 'Gifted Education Programme' in this.specialMoeProgrammes(json)
  },

  lep (json) {
    const programmes = this.specialMoeProgrammes(json)
    if ('LANGUAGE ELECTIVE PROGRAMME (CHINESE)' in programmes) return true
    if ('LANGUAGE ELECTIVE PROGRAMME (ENGLISH)' in programmes) return true
    if ('LANGUAGE ELECTIVE PROGRAMME (MALAY)' in programmes) return true
    return false
  },

  aep (json) {
    const programmes = this.specialMoeProgrammes(json)
    return 'ART ELECTIVE PROGRAMME' in programmes
  },

  mep (json) {
    const programmes = this.specialMoeProgrammes(json)
    return 'MUSIC ELECTIVE PROGRAMME' in programmes
  },

  dep (json) {
    const programmes = this.specialMoeProgrammes(json)
    return 'DRAMA ELECTIVE PROGRAMME' in programmes
  },

  schoolType (json) {
    const result = {}
    const types = json.GeneralInformation['Type of School'] || ''
    types.split(' / ').forEach(token => {
      result[token] = 1
    })
    if (json.GeneralInformation['Status of School']) {
      result[json.GeneralInformation['Status of School']] = 1
    }
    return result
  },

  motherTongue (json) {
    const result = {}
    const mt = json.GeneralInformation['Mother Tongue'] || ''
    mt.split(' / ').forEach(token => {
      if (token === 'Not Available') return
      result[token] = 1
    })
    return result
  },

  affiliation (json) {
    const affiliatedSch = json.GeneralInformation['Affiliated Schools']
    if (affiliatedSch === 'Not Applicable') return []
    if (typeof affiliatedSch === 'string') return [affiliatedSch]
    return affiliatedSch
  },

  affiliated (json) {
    return this.affiliation(json).length > 0
  },

  subjects (json) {
    const result = {}
    json.SubjectOffered.forEach(token => {
      result[standardFilter(token)] = 1
    })
    return result
  },

  ccas (json) {
    const result = {}
    const ccasOffered = json.Cca || {}
    Object.keys(ccasOffered).forEach(group => {
      ccasOffered[group].forEach(name => {
        const token = ccaMapping[standardFilter(name)]
        if (token) result[token] = 1
      })
    })
    return result
  },

  academicProgrammes (json) {
    const result = {}
    const history = []
    if (json.PsleAggregateHistory) history.push(...json.PsleAggregateHistory)
    if (json.L1R5History) history.push(...json.L1R5History)
    history.forEach(row => {
      const scores = [row.lower, row.upper, row.lowerAffiliated, row.upperAffiliated]
      if (scores.some(score => typeof score === 'number')) {
        result[row.programme] = 1
      }
    })
    if ('Special' in result || 'Express' in result) {
      result["'O' Level Programme"] = 1
    }
    return result
  },

  specialMoeProgrammes (json) {
    const result = {}
    const programmes = json.SpecialProgrammes['MOE Programmes'] || []
    programmes.forEach(token => {
      if (token === 'Not Available') return
      result[token] = 1
    })
    return result
  },

  specialProgrammes (json) {
    // const result = {}
    const programmes = json.SpecialProgrammes['School Distinctive Programmes'] || {}

    // const areas = [
    //   'Aesthetics',
    //   'Business & Entrepreneurship',
    //   'Community & Youth Leadership',
    //   'Community Service & Student Leadership',
    //   'Humanities',
    //   'ICT',
    //   'Innovation & Enterprise',
    //   'Interdisciplinary',
    //   'Languages',
    //   'Mathematics',
    //   'Music & Performing Arts',
    //   'STEM',
    //   'Science',
    //   'Sports & Outdoor Education',
    //   'Visual Arts & Design'
    // ]

    // Object.keys(programmes).forEach(key => {
    //   areas.filter(area => key.indexOf(area) > -1).forEach(token => {
    //     result[token] = 1
    //   })
    // })

    return programmes
  },

  sportingAchievements (json) {
    const result = {}

    const binRules = {
      'national.champion' (row) {
        return row.category[0] === 'National' && row.placing === '1st'
      },
      'national.finalist' (row) {
        return row.category[0] === 'National'
      },
      'zone.champion' (row) {
        return row.category[0] === 'Zone' && row.placing === '1st'
      },
      'zone.finalist' (row) {
        return row.category[0] === 'Zone'
      }
    }

    Object.keys(json.AchievementHistory).forEach(level => {
      const achievements = json.AchievementHistory[level]['Sports & Games Competition']
      achievements.forEach(row => {
        let game = standardFilter(row.game)
        game = synonym(game, 'gymnastics', /^gymnastics/)
        game = synonym(game, 'sailing', /^sailing/)
        game = synonym(game, 'taekwondo', /^taekwondo/)
        Object.keys(binRules).forEach(bin => {
          if (binRules[bin](row)) {
            const token = [game, bin].join('.')
            result[token] = result[token] || []
            result[token].push(row)
          }
        })
      })
    })

    Object.keys(result).forEach(token => {
      result[token] = exponentialSmoothing(0.5, 2016)(result[token])
    })

    return result
  },

  syfAchievements (json) {
    const result = {}

    const binRules = {
      distinction (row) {
        return ['distinction', 'accomplishment', 'gold (hons)', 'gold', 'silver', 'bronze'].indexOf(row.award.toLowerCase()) > -1
      },
      accomplishment (row) {
        return ['accomplishment', 'silver', 'bronze'].indexOf(row.award.toLowerCase()) > -1
      },
      'special mention' (row) {
        return ['recognition(sm)', 'recognition'].indexOf(row.award.toLowerCase()) > -1
      },
      recognition (row) {
        return ['recognition'].indexOf(row.award.toLowerCase()) > -1
      }
    }

    Object.keys(json.AchievementHistory).forEach(level => {
      const achievements = json.AchievementHistory[level]['SYF']
      achievements.forEach(row => {
        let category = standardFilter(row.category)
        category = synonym(category, 'art', /^art - category/)
        category = synonym(category, 'band - brass', /^band - brass/)
        category = synonym(category, 'band - display / marching', 'band - display')
        category = synonym(category, 'band - percussion ensemble', 'band - display - percussion ensemble')
        category = synonym(category, 'band - concert', 'concert band')
        category = synonym(category, 'chinese orchestra', /^chinese orchestra/, 'orchestra - chinese')
        category = synonym(category, 'drama', /^drama - entry/)
        category = synonym(category, 'ensemble - handbell / handchime', 'ensemble - handbell')

        if (category.match(/^art & craft/)) {
          row.repeat = +row.award[0]
          row.award = category.slice(13, -1)
          category = 'art & craft'
        }

        Object.keys(binRules).forEach(bin => {
          if (binRules[bin](row)) {
            const token = [category, bin].join('.')
            result[token] = result[token] || []
            result[token].push(row)
          }
        })
      })
    })

    Object.keys(result).forEach(token => {
      result[token] = exponentialSmoothing(0.5, 2016)(result[token])
    })

    return result
  },

  bestUnitAwards (json) {
    const result = {}

    const binRules = {
      gold (row) {
        return ['Gold'].indexOf(row.award) > -1
      },
      silver (row) {
        return ['Gold', 'Silver'].indexOf(row.award) > -1
      },
      bronze (row) {
        return ['Gold', 'Silver', 'Bronze'].indexOf(row.award) > -1
      }
    }

    Object.keys(json.AchievementHistory).forEach(level => {
      const achievements = json.AchievementHistory[level]['Best Unit Award']
      achievements.forEach(row => {
        let category = standardFilter(row.category)
        category = synonym(category, 'brownies', /^brownies /)
        category = synonym(category, 'girl guides', /^girl guides/)
        category = synonym(category, 'scout', /^scout/)
        category = synonym(category, 'ncc (air)', /^ncc \(air/)
        category = synonym(category, 'ncc (land)', /^ncc \(land/)
        category = synonym(category, 'ncc (sea)', /^ncc \(sea/)
        category = synonym(category, 'npcc (land)', /^npcc \(land/)
        category = synonym(category, 'npcc (sea)', /^npcc \(sea/)

        Object.keys(binRules).forEach(bin => {
          if (binRules[bin](row)) {
            const token = [category, bin].join('.')
            result[token] = result[token] || []
            result[token].push(row)
          }
        })
      })
    })

    Object.keys(result).forEach(token => {
      result[token] = exponentialSmoothing(0.5, 2016)(result[token])
    })

    return result
  },

  awards (json) {
    const result = {}
    Object.keys(json.AchievementHistory).forEach(level => {
      Object.keys(json.AchievementHistory[level]).forEach(year => {
        const exclude = [
          'Sports & Games Competition',
          'SYF',
          'Best Unit Award'
        ]
        if (exclude.indexOf(year) > -1) return
        const achievements = json.AchievementHistory[level][year]
        Object.keys(achievements).forEach(category => {
          let awards = achievements[category]
          if (typeof awards === 'string') awards = [awards]
          awards.forEach(award => {
            const token = [category, award].join('.')
            result[token] = result[token] || []
            result[token].push({year})
          })
        })
      })
    })

    Object.keys(result).forEach(token => {
      result[token] = _uniqBy(result[token], 'year')
      result[token] = exponentialSmoothing(0.5, 2016)(result[token])
    })

    return result
  },

  psleAggregate (json) {
    if (!('PsleAggregateHistory' in json)) return []
    let result = json.PsleAggregateHistory
      .filter(row => typeof row.lower === 'number' && typeof row.upper === 'number')
    const latest = _maxBy(result, 'year')
    return result.filter(row => row.year === latest.year)
  },

  l1r5Aggregate (json) {
    if (!('L1R5History' in json)) return []
    let result = json.L1R5History
      .filter(row => typeof row.lower === 'number' && typeof row.upper === 'number')
    const latest = _maxBy(result, 'year')
    return result.filter(row => row.year === latest.year)
  },

  specialNeeds (json) {
    const result = {}
    if (json.specialNeeds) {
      json.specialNeeds.forEach(token => {
        result[token] = 1
      })
    }
    return result
  },

  studentCare (json) {
    return json.studentCare === true
  },

  uniqueCcas (json) {
    const result = []
    const ccasOffered = json.Cca || {}
    Object.keys(ccasOffered).forEach(group => {
      ccasOffered[group].forEach(name => {
        const code = ccaMapping[standardFilter(name)]
        if (code) result.push({name, code, frequency: ccaFrequency[code]})
      })
    })
    return result.sort((a, b) => a.frequency - b.frequency).slice(0, 3)
  }
}
