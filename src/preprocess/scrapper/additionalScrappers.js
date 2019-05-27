import axios from 'axios'
import cheerio from 'cheerio'
import {html2json} from 'html2json'

export function scrapSpecialNeeds () {
  const url = 'https://www.moe.gov.sg/education/special-education/mainstream-schools'
  return axios.get(url, {responseType: 'text'})
    .then(res => cheerio.load(res.data))
    .then(parseSpecialNeeds)
    .catch(console.error)
}

function parseSpecialNeeds ($) {
  const result = {}

  function supportType (text) {
    if (/Hearing Loss.*Signing/.test(text)) return 'HL.Signing'
    if (/Hearing Loss.*Oral/.test(text)) return 'HL.Oral'
    if (/Visual Impairment/.test(text)) return 'VI'
  }

  const $table1 = $('#Provisions-and-Support-in-Mainstream-Schools')
    .nextAll('table').eq(0)
  const $table2 = $('#List-of-Mainstream-Primary-Schools-with-Barrier-Free-Accessibility')
    .nextAll('table').eq(0)
  const $table3 = $('#List-of-Mainstream-Secondary-Schools-and-Junior-Colleges-Centralised-Institute-with-Barrier-Free-Accessibility')
    .nextAll('table').eq(0)
  $table1.find('tr').slice(1).each(function () {
    const $tds = $(this).find('td')
    const group = $tds.eq(0).text().trim().replace(/\s+/g, ' ')
    const schools = $tds.eq(1).find('a').each(function () {
      const school = $(this).text().trim().toUpperCase()
      result[school] = result[school] || []
      result[school].push(supportType(group))
    })
  })
  $table2.find('tr').slice(1).each(function () {
    const $tds = $(this).find('td')
    const school = $tds.last().text().trim().toUpperCase()
    result[school] = result[school] || []
    result[school].push('PD')
  })
  $table3.find('tr').slice(1).each(function () {
    const $tds = $(this).find('td')
    const school = $tds.last().text().trim().toUpperCase()
    result[school] = result[school] || []
    result[school].push('PD')
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
    .catch(console.error)
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
    .catch(console.error)
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
    .catch(console.error)
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
    .catch(console.error)
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
    .catch(console.error)
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
