import axios from 'axios'
import {html2json} from 'html2json'

const parsers = {
  GeneralInformation: parseGeneralInformation,
  SubjectOffered: parseSubjectOffered,
  Cca: parseCca,
  AchievementHistory: parseAchievementHistory,
  SpecialProgrammes: parseSpecialProgrammes,
  PsleAggregateHistory: parsePsleAggregateHistory,
  L1R5History: parseL1R5History
}

export default function scrap (endpoint, options) {
  const url = getUrl(endpoint, options)
  return axios.get(url, {responseType: 'text'})
    .then(res => res.data)
    .then(html => {
      const body = html
        .replace(/\r?\n|\r/g, '')
        .replace(/>\s+</g, '><')
        .match(/<body>(.*)<\/body>/)[0]
      const json = html2json(body)

      return endpoint ? parsers[endpoint](json) : parseContactInfo(json)
    })
}

function getUrl (page, query) {
  let url = page
    ? 'https://sis.moe.gov.sg/Pages/SchoolDetails/' + page + '.aspx'
    : 'https://sis.moe.gov.sg/SchoolDetails.aspx'
  if (query) {
    url += '?' + Object.keys(query).map(key => key + '=' + query[key]).join('&')
  }
  console.log(url)
  return url
}

function parseContactInfo (body) {
  return body
    .child[0].child[0].child[1].child[0].child[0].child
    .filter(c => c.tag === 'div')[0].child[2].child[0].child[0].child[0].child
    .reduce((j, c, i) => {
      if (i === 0) j.uen = c.child[0].text.substring(4)
      else if (i === 1) j.logo = c.child[0].attr.src
      // else if (i === 2) {
      //   try {
      //     j.name = c.child[0].child[0].child[0].text
      //   } catch (err) {}
      // } else if (i === 3 && !j.name) {
      //   j.name = c.child[0].child[0].child[0].text
      else if (i === 5) j.website = c.child[0].child[0].text
      else if (i === 11) j.address = c.child[0].text
      else if (i === 13) {
        j.telephone = c.child[0].child[1].child
          .filter(c => c.node === 'text').map(c => c.text)
        j.fax = c.child[1].child[1].child
          .filter(c => c.node === 'text').map(c => c.text)
      } else if (i === 16) {
        try {
          j.email = c.child[0].child[0].text
        } catch (err) {}
      } else if (i === 21) {
        try {
          j.mrt = c.child[1].child[1].child[0].text
        } catch (err) {}
        try {
          j.bus = c.child[1].child[4].child[0].text
        } catch (err) {}
      }
      return j
    }, {})
}

function parseGeneralInformation (body) {
  return body
    .child[0].child[0].child[3].child
    .filter(c => c.tag === 'table').map(c => c.child[1].child[1].child)
    .reduce((j, c) => {
      const key = c[0].child[0].text
      if (key === 'PSLE Aggregate Score') return j
      if (key === 'L1R5 Aggregate Range (With Bonus Points)') return j
      let value
      if (!c[1].child) return j
      if (key === 'Affiliated Schools' || key === 'IP Partner Schools') {
        value = c[1].child.filter(c => c.tag === 'a').map(c => c.child[0].text)
        if (value.length === 0) value = 'Not Applicable'
      } else {
        value = c[1].child.filter(c => c.node === 'text').map(c => c.text)
      }
      if (value.length === 1) value = value[0]
      return Object.assign(j, {[key]: value})
    }, {})
}

function parseSubjectOffered (body) {
  try {
    return body
      .child[0].child[0].child[3].child[0].child[1].child[1].child[1].child[0].child
      .filter(c => c.child).reduce((a, c) => {
        const _a = c.child.filter(c => c.node === 'text').map(c => c.text)
        a.push(..._a)
        return a
      }, [])
  } catch (err) {
    return []
  }
}

function parseCca (body) {
  return body
    .child[0].child[0].child[3].child
    .filter(c => c.tag === 'table').map(c => c.child[1].child[1].child)
    .reduce((j, c) => {
      if (!c[1].child[0].child) return j
      const key = c[0].child[0].text
      const value = c[1].child[0].child
        .filter(c => c.child)
        .reduce((a, c) => {
          const _a = c.child.filter(c => c.node === 'text').map(c => c.text)
          a.push(..._a)
          return a
        }, [])
      return Object.assign(j, {[key]: value})
    }, {})
}

function parseAchievementHistory (body) {
  return body
    .child[0].child[0].child[3].child
    .filter((c, i, arr) => (i > 0) && (i < arr.length - 1))
    .map(c => c.child[1].child[1].child[1].child)
    .reduce((j, c) => {
      const key = c[0].child[0].text
      let value
      const isTable = [
        'Sports & Games Competition',
        'SYF Arts Presentation',
        'SYF Central Judging',
        'Best Unit Award'
      ].indexOf(key) > -1
      if (isTable) {
        value = c.filter(c => c.tag === 'table')[0].child
        if (key === 'Sports & Games Competition') {
          const _value = []
          value.forEach(c => {
            if (c.tag === 'tr') {
              const a = []
              c.child.forEach(c => {
                const repeat = (c.attr && +c.attr.colspan) || 1
                const text = (c.child && c.child[0].text) || ''
                for (let i = 0; i < repeat; i++) {
                  a.push(text)
                }
              })
              _value.push(a)
            } else if (c.child) {
              c.child.forEach(c => {
                _value.push(c.child.map(c => c.child[0].text))
              })
            }
          })
          value = _value
        } else {
          value = value[1].child.reduce((j, c) => {
            const key = c.child[0].child[0].text
            const value = c.child[1].child[0].text
            return Object.assign(j, {[key]: value})
          }, {})
        }
      } else {
        value = c[1].child.filter(c => c.node === 'text').map(c => c.text)
        if (value.length === 1) value = value[0]
      }

      return Object.assign(j, {[key]: value})
    }, {})
}

function parseSpecialProgrammes (body) {
  return body
    .child[0].child[0].child[3].child
    .filter(c => c.tag === 'table').map(c => c.child[1].child[1].child)
    .reduce((j, c) => {
      const key = c[0].child[0].text
      let value = c[1].child
      if (key === 'MOE Programmes') {
        value = value.filter(c => c.node === 'text').map(c => c.text)
      } else if (key === 'School Distinctive Programmes') {
        const _value = {}
        while (value.length) {
          const group = value.splice(0, 3)
          const k = group[0].child[0].child[0].text
          let v = group[1].child.map(c => c.text)
          if (v.length === 1) v = v[0]
          _value[k] = v
        }
        value = _value
      } else {
        value = value[0].text
      }
      return Object.assign(j, {[key]: value})
    }, {})
}

function parsePsleAggregateHistory (body) {
  try {
    return body
      .child[0].child[0].child[3].child
      .filter(c => c.tag === 'table')[0].child[2].child.map(c => c.child)
      .reduce((j, c) => {
        const key = c[0].child[0].text
        const value = c.slice(1).filter(c => c.child).map(c => c.child[0].text)
        return Object.assign(j, {[key]: value})
      }, {})
  } catch (err) {
    return {}
  }
}

function parseL1R5History (body) {
  try {
    return body
      .child[0].child[0].child[3].child
      .filter(c => c.tag === 'table')[0].child
      .filter(c => c.tag === 'tr').slice(1).map(c => c.child)
      .reduce((j, c) => {
        const key = c[0].child[0].text
        const value = c[2].child[0].child[0].child.map(c => c.child[0].text)
        return Object.assign(j, {[key]: value})
      }, {})
  } catch (err) {
    return {}
  }
}
