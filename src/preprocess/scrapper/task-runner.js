import range from 'lodash/range'
import aggregate from './aggregator'
import schoolList from '../../../data/schoolList.json'

const defaultYearRange = range(2005, 2018).map(v => v.toString())

export default function runTask (indexes, years = defaultYearRange) {
  const debug = []
  Promise.all(indexes.map((n, i) => {
    const base = schoolList[n]
    if (!base) return
    return queue.push().then(() => {
      const counter = indexes.length - i
      if (counter % 10 === 0) console.log(counter)
      return aggregate(base, years)
    }).catch(err => {
      console.error(err)
      debug.push(n)
    })
  })).then(() => {
    if (debug.length > 0) console.log('Not successful:', debug)
  })
}

const queue = {
  eoq: Promise.resolve(),
  push () {
    this.eoq = this.eoq
      .then(() => new Promise(resolve => setTimeout(resolve, 5000)))
    return this.eoq
  }
}

// function randomDelay () {
//   return 15000 + Math.random() * 10000
// }
