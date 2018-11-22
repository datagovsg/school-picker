const AWS = require('aws-sdk')
const credentials = new AWS.SharedIniFileCredentials({profile: 'yongjun21'})
const s3 = new AWS.S3({apiVersion: '2006-03-01', region: 'ap-southeast-1', credentials})

const fs = require('fs')
const zlib = require('zlib')

const entityList = require('../../public/data/entityList.json')
upload(entityList, 'entityList.json')

const filenames = fs.readdirSync('public/data/entities/')
  .filter(file => file.match(/\.json$/))
filenames.forEach(filename => {
  const entity = require('../../public/data/entities/' + filename)
  upload(entity, 'entities/' + filename)
})

function upload (entity, filename) {
  zlib.gzip(JSON.stringify(entity), (err, buffer) => {
    if (err) console.error(err)
    else {
      s3.putObject({
        Body: buffer,
        Bucket: 'school-picker',
        Key: filename,
        ContentType: 'application/json',
        ContentEncoding: 'gzip',
        ACL: 'public-read',
        CacheControl: 'max-age=3600'
      }, function (err) {
        if (err) console.error(err)
      })
    }
  })
}
