export function collectValues (obj) {
  const values = []
  Object.keys(obj).forEach(key => {
    if (key === 'value') {
      values.push(obj[key])
    } else if (key === 'values') {
      values.push(...obj[key])
    } else if (typeof obj[key] === 'object') {
      values.push(...collectValues(obj[key]))
    }
  })
  return values
}

export function optionsSelected (options, selected) {
  return collectValues(options).every(option =>
    selected.indexOf(option) > -1)
}
