import axios from 'axios'
import cheerio from 'cheerio'
import {html2json} from 'html2json'

export function scrapSpecialNeeds () {
  const url = 'https://www.moe.gov.sg/education/programmes/resources-to-support-mainstream-students-with-special-needs'
  return axios.get(url, {responseType: 'text'})
    .then(res => res.data)
    .then(html => {
      html = html.replace(/\r?\n|\r/g, '').replace(/>\s+</g, '><')

      const tables = [
        html.match(/<table>.*<\/table>/)[0],
        ...html.match(/<table id="table-1".*?<\/table>/g)
      ]

      const jsons = tables.map(html2json)
      return parseSpecialNeeds(jsons)
    })
    .catch(err => {
      console.error(err.stack)
    })
}

function parseSpecialNeeds ([handicap, ...tables]) {
  const result = {secondary: {}, handicap: []}
  tables.forEach(table => {
    table.child[0].child[0].child.slice(1)
      .map(c => c.child.slice(-6))
      .map(c => c.map(c => c.child[0].text))
      .forEach(row => {
        const key = row[1]
        const value = []
        if (row[2].indexOf('Signing') > -1) value.push('HL.Signing')
        else if (row[2].indexOf('Oral') > -1) value.push('HL.Oral')
        if (row[3] !== '&nbsp;') value.push('VI')
        if (row[4] !== '&nbsp;') value.push('PD')
        if (row[5] !== '&nbsp;') value.push('Mild SEN')
        if (value.length > 0) result.secondary[key] = value
      })
  })
  handicap
    .child[0].child[0].child.slice(1)
    .map(c => c.child.map(c => c.child[0].text))
    .forEach(row => {
      const key = row[0].toUpperCase().replace(/ +/g, ' ')
      result.handicap.push(key)
    })

  return result
}

export function scrapStudentCare () {
  const url = 'http://sis.moe.gov.sg/Pages/SchoolUpdates/SchoolBasedStudentCareCentres.aspx'
  return axios.get(url, {responseType: 'text'})
    .then(res => res.data)
    .then(html => {
      const table = html
        .replace(/\r?\n|\r/g, '').replace(/>\s+</g, '><')
        .match(/<table.*<\/table>/)[0]
      const json = html2json(table)
      return parseStudentCare(json)
    })
    .catch(err => {
      console.error(err.stack)
    })
}

function parseStudentCare (table) {
  return table.child[0].child
    .filter(c => c.attr && c.attr.id && c.attr.id === 'schoolListContent')[0].child
    .map(c => c.child[0].child[0].child[0].text.toUpperCase())
}

export function scrapRelocatedSchools () {
  const url = 'http://sis.moe.gov.sg/Pages/SchoolUpdates/RelocatedSchools.aspx'
  return axios.get(url, {responseType: 'text'})
    .then(res => res.data)
    .then(html => {
      const table = html
        .replace(/\r?\n|\r/g, '').replace(/>\s+</g, '><')
        .match(/<table.*<\/table>/)[0]
      const json = html2json(table)
      return parseRelocatedSchools(json)
    })
    .catch(err => {
      console.error(err.stack)
    })
}

function parseRelocatedSchools (table) {
  const rows = table.child[0].child
    .filter(c => c.attr && c.attr.class === 'moeContentRow')
    .map(c => c.child
      .map(c => c.child
        .filter(c => c.tag !== 'br')
      )
    )

  return rows.map(c => {
    const array = []
    array[0] = c[0][0].child[0].text
    array[1] = c[0][1].child.filter(c => c.node === 'text').map(c => c.text).join().replace(/^\s+|\s+$/g, '')
    array[2] = c[1].filter(c => c.node === 'text').map(c => c.text).join().trim()
    array[3] = c[2][0].text
    return array
  })
}

export function scrapMergerSchools () {
  const url = 'http://sis.moe.gov.sg/Pages/SchoolUpdates/MergerSchools.aspx'
  return axios.get(url, {responseType: 'text'})
    .then(res => res.data)
    .then(html => {
      const table = html
        .replace(/\r?\n|\r/g, '').replace(/>\s+</g, '><')
        .match(/<table.*<\/table>/)[0]
      const json = html2json(table)
      return parseMergerSchools(json)
    })
    .catch(err => {
      console.error(err.stack)
    })
}

function parseMergerSchools (table) {
  const rows = table.child[0].child
    .filter(c => c.attr && c.attr.class === 'moeContentRow')
    .map(c => c.child
      .map(c => c.child))

  const parsedSchools = rows.map(c => {
    const array = []
    array[0] = c[0][0].text
    array[1] = c[1][0].text
    array[2] = c[2].filter(c => c.node === 'text').map(c => c.text.replace(/^\s+|\s+$/g, '')).join()
    array[3] = c[3][0].text

    return array
  })

  return parsedSchools
}

export function scrapNewSchools () {
  const url = 'http://sis.moe.gov.sg/Pages/SchoolUpdates/NewSchools.aspx'
  return axios.get(url, {responseType: 'text'})
    .then(res => res.data)
    .then(html => {
      const table = html
        .replace(/\r?\n|\r/g, '').replace(/>\s+</g, '><')
        .match(/<table.*<\/table>/)[0]
      const json = html2json(table)
      return parseNewSchools(json)
    })
    .catch(err => {
      console.error(err.stack)
    })
}

function parseNewSchools (table) {
  return table.child[0].child
    .filter(c => c.attr && c.attr.class === 'moeContentRow')
    .map(c => c.child
      .map(c => c.child[0].text)
    )
}

export function scrapVacancies () {
  const url = 'https://www.moe.gov.sg/admissions/primary-one-registration/vacancies'
  return axios.get(url, {responseType: 'text'})
    .then(res => cheerio.load(res.data))
    .then(parseVacancies)
    .catch(err => {
      console.error(err.stack)
    })
}

function parseVacancies ($) {
  const result = {}
  $('table').each(function () {
    const $trs = $(this).find('tr')
    const $headers = $trs.eq(0).find('td')
    const headers = $headers.slice(2)
      .map((i, el) => $(el).text()).get()
      .map(h => removeArtifacts(h).toUpperCase())
    const $rows = $trs.slice(2)
    $rows.each(function () {
      const $row = $(this).find('td')
      const school = $row.eq(0).text().trim()
      result[school] = {}
      headers.forEach((key, i) => {
        const value = +removeArtifacts($row.eq(i + 4).text())
        result[school][key] = value
      })
    })
  })
  return result
}

function removeArtifacts (str) {
  return str.trim().replace(/&nbsp;/g, '').replace(/\u200b/g, '').replace(/\s\s+/g, ' ')
}

// https://www.moe.gov.sg/admissions/primary-one-registration/balloting
