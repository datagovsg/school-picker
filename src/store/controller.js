import {collectValues} from 'helpers/util'

const singleInputs = [
  'schoolLevel',
  'psle',
  'l1r5'
]

const multiInputs = [
  'planningAreas',
  'ccasOffered',
  'distinctiveProgrammes',
  'schoolTypes',
  'specialNeeds'
]

export function getFiltered (state, getters) {
  return state.schoolList
    .filter(school => {
      let match = true
      if (state.schoolLevel.selected) {
        const selected = state.schoolLevel.selected
        match = match && school.levelOfEducation.indexOf(selected) > -1
      }
      if (state.planningAreas.selected.length > 0) {
        const selected = state.planningAreas.selected
        match = match && selected.indexOf(school.planningArea) > -1
      }
      if (state.ccasOffered.selected.length > 0) {
        const selected = state.ccasOffered.selected
        match = match && selected.some(cca => cca in school.ccas)
      }
      if (state.distinctiveProgrammes.selected.length > 0) {
        const selected = state.distinctiveProgrammes.selected
        match = match && selected.some(program => {
          return Object.keys(school.specialProgrammes)
            .some(key => key.indexOf(program) > -1)
        })
      }
      if (state.specialNeeds.selected.length > 0) {
        const selected = state.specialNeeds.selected
        match = match && selected.some(need => {
          if (need === 'HL') return 'HL.Signing' in school.specialNeeds || 'HL.Oral' in school.specialNeeds
          return need in school.specialNeeds
        })
      }
      if (state.schoolTypes.selected.length > 0) {
        const selected = state.schoolTypes.selected
        match = match && selected.some(type => {
          if (type === 'G') return 'Government School' in school.schoolType || 'Government-aided Sch' in school.schoolType
          else if (type === 'I') return 'Independent School' in school.schoolType || 'Specialised Independent School' in school.schoolType
          else if (type === 'S') return 'Specialised School' in school.schoolType || 'Specialised Independent School' in school.schoolType
          else if (type === 'BOYS') return "Boys' School" in school.schoolType
          else if (type === 'GIRLS') return "Girls' School" in school.schoolType
          else if (type === 'COED') return 'Co-ed School' in school.schoolType
        })
      }
      if (state.psle.selected) {
        const selected = +state.psle.selected
        const selectedRange = {lower: selected, upper: selected + 9}
        match = match && school.psleAggregate.some(range => {
          return range.lower <= selectedRange.upper &&
            Math.min(range.lower + 45, range.upper) >= selectedRange.lower
        })
      }
      if (state.l1r5.selected) {
        const selected = +state.l1r5.selected
        match = match && school.l1r5Aggregate.some(range => range.upper >= selected)
      }
      return match
    })
    .map(school => school.id)
}

export function getSuggested (state, getters) {
  return []
}

export function importOptions (context, query) {
  if (query.shortlist) {
    const bookmarked = context.state.schoolList.map(school => school.id)
      .filter(id => query.shortlist.split(',').indexOf(id) > -1)
    context.commit('setBookmarked', bookmarked)
  } else {
    context.commit('setBookmarked', [])
  }

  singleInputs.forEach(module => {
    if (query[module]) {
      const match = query[module].toUpperCase()
      const updated = collectValues(context.state[module].options)
        .indexOf(match) > -1 ? match : ''
      context.commit('updateSelected', {module, updated})
    } else {
      context.commit('updateSelected', {module, updated: null})
    }
  })

  multiInputs.forEach(module => {
    if (query[module]) {
      const matches = query[module].split(',')
        .map(str => str.trim().toUpperCase())
      const updated = collectValues(context.state[module].options)
        .filter(option => matches.indexOf(option) > -1)
      context.commit('updateSelected', {module, updated})
    } else {
      context.commit('updateSelected', {module, updated: []})
    }
  })

  if (query.postalCode && query.postalCode.match(/^\d{6}$/)) {
    context.dispatch('locateAddress', query.postalCode).then(match =>
      context.dispatch('homeSchoolDistance/queryOnemap', {
        postalCode: query.postalCode,
        blkNo: match.BLK_NO
      })
    )
  } else {
    context.commit('setPostalCode', null)
    context.commit('setLocation', null)
  }
}

export function exportOptions (context) {
  const query = {}

  singleInputs.forEach(module => {
    if (context.state[module].selected) {
      query[module] = context.state[module].selected
    }
  })

  multiInputs.forEach(module => {
    if (context.state[module].selected.length > 0) {
      query[module] = context.state[module].selected.join(',')
    }
  })

  if (context.state.bookmarked.length > 0) {
    query.shortlist = context.state.bookmarked.join(',')
  }
  if (context.state.postalCode) {
    query.postalCode = context.state.postalCode
  }
  return query
}
