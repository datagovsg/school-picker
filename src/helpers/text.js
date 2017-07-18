export function standardFilter (token) {
  return token
    .trim()
    .toLowerCase()
    .replace(/ +/g, ' ') // remove extra space char
    .replace(/\./g, '') // remove .
    .replace(/'/g, '') // remove '
    .replace(/ ?\( ?/g, ' (') // normalize (
    .replace(/ \)/g, ')') // normalize )
    .replace(/ and /g, ' & ') // normalize and
    .replace(/ ?& ?/g, ' & ') // normalize &
    .replace(/ ?\/ ?/g, ' / ') // normalize /
    .replace(/ ?- ?/g, ' - ') // normalize -
    .replace(/ ?, ?/g, ', ') // normalize @
    .replace(/ ?@ ?/g, ' @ ') // normalize @
}

export function synonym (token, replacement, ...patterns) {
  for (let pattern of patterns) {
    if (pattern instanceof RegExp && token.match(pattern)) return replacement
    if (token === pattern) return replacement
  }
  return token
}

export function acronym (token, ...patterns) {
  for (let pattern of patterns) {
    token = token.replace(pattern, match => match.toUpperCase())
  }
  return token
}

export function capitalize (str, splitOnDash = false) {
  return str.split(' ').filter(substr => substr.length > 0).map(substr => {
    const words = splitOnDash ? substr.split('-') : [substr]
    return words.filter(word => word.length > 0).map(word => {
      if (word[0] === '(') return '(' + word[1].toUpperCase() + word.slice(2).toLowerCase()
      return word[0].toUpperCase() + word.slice(1).toLowerCase()
    }).join('-')
  }).join(' ')
}
