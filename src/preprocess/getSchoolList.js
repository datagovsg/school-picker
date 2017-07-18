import fs from 'fs'
import fetch from 'node-fetch'

const url = 'http://sis.moe.gov.sg/WebServices/SchoolService.asmx/getChosenSchoolByEducationLevel'

const options = {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
}

const levels = ['P', 'S', 'J', 'F', 'T']

const apiCalls = levels.map(level => {
  const body = JSON.stringify({educationLevel: level})
  return fetch(url, Object.assign({body}, options))
    .then(res => res.json())
    .then(json => json.d)
    .then(JSON.parse)
    .then(data => data.map(d => ({code: d.schoolCode, name: d.name})))
})

Promise.all(apiCalls)
  .then(schoolsByLevel => {
    const schoolList = []
    schoolsByLevel.forEach((schools, i) => {
      schools.forEach(school => {
        const match = schoolList.filter(row => row.code === school.code)[0]
        if (match) {
          match.levels += levels[i]
        } else {
          school.levels = levels[i]
          schoolList.push(school)
        }
      })
    })
    fs.writeFileSync('data/schoolList.json', JSON.stringify(schoolList))
  })
  .catch(console.error)
