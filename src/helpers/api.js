import axios from 'axios'

let onemapToken
fetchOnemapToken()

export function onemapApi (cb) {
  if (onemapToken) {
    return cb(onemapToken).catch(err => {
      if (err.message === 'Your token has expired!') {
        onemapToken = null
        return onemapApi(cb)
      }
      throw err
    })
  } else {
    return fetchOnemapToken().then(cb)
  }
}

function fetchOnemapToken () {
  const url = 'https://developers.onemap.sg/publicapi/publicsessionid'
  return axios.get(url).then(res => res.data).then(json => {
    onemapToken = json.access_token
    console.log('Using OneMap access token:', onemapToken)
    return onemapToken
  })
}
