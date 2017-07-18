import fetch from 'node-fetch'

let onemapToken
fetchOnemapToken()

export function onemapApi (cb) {
  if (onemapToken) {
    return cb(onemapToken).catch(err => {
      if (err.message === 'Token has expired.') {
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
  const url = 'https://www.onemap.sg/AuthServices/TokenService.svc/GetNewToken'
  const options = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({'AccessKey': process.env.ONEMAP_ACCESS_KEY})
  }

  return fetch(url, options).then(res => res.json()).then(json => {
    onemapToken = json.Token
    console.log('Using OneMap token:', onemapToken)
    return onemapToken
  })
}
