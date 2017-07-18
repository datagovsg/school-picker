import range from 'lodash/range'
import aggregate from './aggregator'
import schoolList from '../../../data/schoolList.json'

const defaultYearRange = range(2005, 2018).map(v => v.toString())

export default function runTask (indexes, years = defaultYearRange) {
  indexes.forEach((n, i) => {
    const base = schoolList[n]
    if (!base) return
    queue.push().then(() => {
      const counter = indexes.length - i
      if (counter % 10 === 0) console.log(counter)
      aggregate(base, years)
    }).catch(console.error)
  })
}

const queue = {
  eoq: Promise.resolve(),
  push () {
    this.eoq = this.eoq
      .then(() => new Promise(resolve => setTimeout(resolve, 2000)))
    return this.eoq
  }
}

// function randomDelay () {
//   return 15000 + Math.random() * 10000
// }
