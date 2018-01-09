import fs from 'fs'
import _sortBy from 'lodash/sortBy'
import _uniq from 'lodash/uniq'
import _entries from 'lodash/entries'

export function getData (featureExtractor, fields) {
  const data = {}
  fields.forEach(field => {
    data[field] = {}
  })
  const filenames = fs.readdirSync('public/data/schools/')
    .filter(file => file.match(/\.json$/))
  filenames.forEach(filename => {
    const school = require('../../public/data/schools/' + filename)
    fields.forEach(field => {
      data[field][school.id] = featureExtractor[field](school)
    })
  })
  return data
}

export function generateInvertedIndex (featureExtractor, fields, sortFunction) {
  let result = getData(featureExtractor, fields)
  Object.keys(result).forEach(field => {
    const invertedIndex = documentMatch(result[field])

    Object.keys(invertedIndex).forEach(term => {
      if (term.match(/\b\.\b/)) {
        const subTerms = term.split(/\b\.\b/)
        while (subTerms.length) {
          const ngram = subTerms.join(' ')
          invertedIndex[ngram] = invertedIndex[ngram] || []
          invertedIndex[ngram] = invertedIndex[ngram].concat(invertedIndex[term])
          subTerms.pop()
        }
      }
    })

    Object.keys(invertedIndex).forEach(term => {
      if (term.match(/\b\.\b/)) delete invertedIndex[term]
      else invertedIndex[term] = _uniq(invertedIndex[term])
    })

    result[field] = invertedIndex

    if (sortFunction) {
      const sortedIndex = {}
      let entries = _entries(invertedIndex)
      entries = _sortBy(entries, sortFunction)
      entries.forEach(([key, value]) => {
        sortedIndex[key] = value
      })
      result[field] = sortedIndex
    }
  })

  fs.writeFileSync('data/invertedIndex.json', JSON.stringify(result))
  return result
}

export function generateForwardIndex (featureExtractor, fields) {
  const result = {}
  const data = getData(featureExtractor, fields)
  Object.keys(data).forEach(field => {
    Object.keys(data[field]).forEach(doc => {
      result[doc] = result[doc] || {}
      result[doc][field] = data[field][doc]
    })
  })
  fs.writeFileSync('data/forwardIndex.json', JSON.stringify(result))
  return result
}

export function listTokens (featureExtractor, fields) {
  const data = getData(featureExtractor, fields)
  fields.forEach(field => {
    const frequency = documentFrequency(data[field], keyValue => keyValue[0])
    fs.writeFileSync('data/tokens/' + field + '.json', JSON.stringify(frequency, null, '\t'))
  })
}

export function knn (query, data, computeDistance) {
  const nn = []
  Object.keys(data).forEach(neighbour => {
    nn.push({
      id: neighbour,
      distance: computeDistance(query, data[neighbour])
    })
  })
  return _sortBy(nn, 'distance')
}

export function tfIdf (data) {
  const documentCount = Object.keys(data).length

  const df = documentFrequency(data)
  const Idf = {}
  Object.keys(df).forEach(term => {
    Idf[term] = Math.log(documentCount / (1 + df[term]))
  })

  const result = {}
  Object.keys(data).forEach(doc => {
    result[doc] = {}
    Object.keys(data[doc]).forEach(term => {
      result[doc][term] = data[doc][term] * Idf[term]
    })
  })

  return result
}

export function documentFrequency (data, sortFunction) {
  const result = documentMatch(data)
  Object.keys(result).forEach(term => {
    result[term] = result[term].length
  })

  if (sortFunction) {
    const sortedResult = {}
    let entries = _entries(result)
    entries = _sortBy(entries, sortFunction)
    entries.forEach(([key, value]) => {
      sortedResult[key] = value
    })
    return sortedResult
  }

  return result
}

export function documentMatch (data) {
  const result = {}
  Object.keys(data).forEach(doc => {
    if (data[doc] == null || typeof data[doc] === 'boolean' || typeof data[doc] === 'string') {
      const term = data[doc]
      result[term] = result[term] || []
      result[term].push(doc)
    } else if (data[doc] instanceof Array) {
      data[doc].forEach(term => {
        result[term] = result[term] || []
        result[term].push(doc)
      })
    } else {
      Object.keys(data[doc]).forEach(term => {
        result[term] = result[term] || []
        result[term].push(doc)
      })
    }
  })
  return result
}

export function testEquality (a, b) {
  return a === b ? 0 : 1
}

export function commonMember (a, b) {
  return dotProduct(a, b) > 0 ? 0 : 1
}

export function cosineDistance (a, b) {
  if (Object.keys(a).length === 0 || Object.keys(b).length === 0) return 1
  const norm = Math.sqrt(dotProduct(a, a) * dotProduct(b, b))
  return 1 - dotProduct(a, b) / norm
}

function dotProduct (a, b) {
  let result = 0
  Object.keys(a).forEach(key => {
    if (key in b) result += a[key] * b[key]
  })
  return result
}

export function jaccardDistance (a, b) {
  if (a.length === 0 || b.length === 0) return 1
  const setA = rangeUnion(a)
  const setB = rangeUnion(b)
  const setAuB = rangeUnion([...a, ...b])
  const sizeA = setA.reduce((sum, range) => sum + range.upper - range.lower, 0)
  const sizeB = setB.reduce((sum, range) => sum + range.upper - range.lower, 0)
  const sizeAuB = setAuB.reduce((sum, range) => sum + range.upper - range.lower, 0)
  return 1 - (sizeA + sizeB - sizeAuB) / sizeAuB
}

function rangeUnion (ranges) {
  const result = []
  const sorted = _sortBy(ranges, r => -r.lower)
  let test = Object.assign({}, sorted.pop())
  while (sorted.length > 0) {
    const next = sorted.pop()
    if (test.upper < next.lower) {
      result.push(test)
      test = Object.assign({}, next)
    } else {
      test.upper = Math.max(test.upper, next.upper)
    }
  }
  result.push(test)
  return result
}

export function euclideanDistance (a, b) {
  let result = 0
  Object.keys(a).forEach(key => {
    if (key in b) result += Math.pow(a[key] - b[key], 2)
    else result += Math.pow(a[key], 2)
  })
  Object.keys(b).forEach(key => {
    if (!(key in a)) result += Math.pow(b[key], 2)
  })
  return Math.sqrt(result)
}

export function exponentialSmoothing (factor, BASEYEAR) {
  return function (data) {
    const timeseries = []
    data.forEach(row => {
      const index = BASEYEAR - +row.year
      timeseries[index] = timeseries[index] || 0
      timeseries[index] += row.repeat || 1
    })
    return timeseries.reduce((aggregate, value, index) =>
      aggregate + factor * Math.pow(1 - factor, index) * value, 0)
  }
}
