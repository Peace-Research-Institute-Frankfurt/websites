const axios = require('axios')
const fs = require('fs')
const qs = require('qs')
const path = require('path')

const sleep = function (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const cities = [{ name: 'Landkreis Konstanz, DE' }]

const getCoordinates = async (s) => {
  console.log(`Looking for ${s}...`)
  const options = {
    q: s,
    format: 'jsonv2',
  }
  const url = `https://nominatim.openstreetmap.org/search?${qs.stringify(options)}`
  console.log(url)
  let res = await axios({
    method: 'get',
    headers: { 'user-agent': 'Peace Research Institute Frankfurt / GeocodeCities' },
    url: url,
  })

  const result = res.data[0]

  console.log(res.data)
}

for (let i = 0; i < cities.length; i++) {
  const c = cities[i]
  getCoordinates(c.name)
  sleep(1000)
}

fs.writeFileSync('./cities.json', JSON.stringify(cities, null, '  '))
