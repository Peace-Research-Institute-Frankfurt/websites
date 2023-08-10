import axios from 'axios'
import fs from 'fs'
import qs from 'qs'
import path from 'path'
import { parse } from 'csv-parse/sync'

const sleep = function (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const csvOptions = {
  columns: true,
}

let cities = []
let uniqueCities = []
let geocodedCities = []
const cooperations = parse(fs.readFileSync('./content/de/reports/2022/data/cooperations.csv'), csvOptions)
const residencies = parse(fs.readFileSync('./content/de/reports/2022/data/residencies.csv'), csvOptions)
const guests = parse(fs.readFileSync('./content/de/reports/2022/data/guests.csv'), csvOptions)

cooperations.forEach((c) => {
  const newCities = c.cities.split(';').map((el) => {
    return el.trim()
  })
  cities = [...cities, ...newCities]
})
residencies.forEach((c) => {
  const newCities = c.city.split(';').map((el) => {
    return el.trim()
  })
  cities = [...cities, ...newCities]
})
guests.forEach((c) => {
  const newCities = c.city.split(';').map((el) => {
    return el.trim()
  })
  cities = [...cities, ...newCities]
})

console.log(cities.length)

cities = cities.filter((el) => {
  return el !== ''
})

cities.forEach((el) => {
  if (!uniqueCities.includes(el)) {
    uniqueCities.push(el)
  }
})

uniqueCities.sort()

console.log(`Found ${uniqueCities.length} unique cities, starting geocoding...`)

const getCoordinates = async (s) => {
  const options = {
    q: s,
    format: 'jsonv2',
    addressdetails: 1,
  }
  const url = `https://nominatim.openstreetmap.org/search?${qs.stringify(options)}`
  let res = await axios({
    method: 'get',
    headers: { 'user-agent': 'Peace Research Institute Frankfurt / GeocodeCities' },
    url: url,
  })
  if (res.data.length > 0) {
    const result = res.data[0]
    return { lat: result.lat, lon: result.lon, country: result.address.country_code }
  } else {
    console.log(`Found no results for "${s}"`)
    return false
  }
}
fs.writeFileSync('./unique_cities.json', JSON.stringify(uniqueCities, null, '  '))

async function geocode() {
  for (let i = 0; i < uniqueCities.length; i++) {
    const c = uniqueCities[i]
    console.log(`${i + 1}/${uniqueCities.length}: ${c}`)
    const coordinates = await getCoordinates(c)

    if (coordinates) {
      geocodedCities.push({ name: c, lat: parseFloat(coordinates.lat), long: parseFloat(coordinates.lon), country: coordinates.country })
    }

    fs.writeFileSync('./cities.json', JSON.stringify(geocodedCities, null, '  '))

    await sleep(2000)
  }
}

geocode()
