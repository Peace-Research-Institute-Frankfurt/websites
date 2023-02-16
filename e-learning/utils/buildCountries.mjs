import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const addedMembers = ['Guinea-Bissau', 'Cook Islands', 'Niue', 'Palestine']
const nameSubs = { 'DR Congo': 'Democratic Republic of the Congo', 'United States': 'United States of America' }
const addArticle = [
  'Netherlands',
  'United States',
  'United Arab Emirates',
  'United Kingdom',
  'Central African Republic',
  'Dominican Republic',
  'Republic of Congo',
  'DR Congo',
  'Republic of the Congo',
  'Marshall Islands',
  'Solomon Islands',
  'Cook Islands',
  'Philippines',
  'Maldives',
  'Seychelles',
]

const addPlural = [
  'Netherlands',
  'United States',
  'United Arab Emirates',
  'Marshall Islands',
  'Solomon Islands',
  'Cook Islands',
  'Saint Vincent and the Grenadines',
  'Maldives',
  'Philippines',
  'Seychelles',
]

const raw = JSON.parse(fs.readFileSync(path.join(__dirname, './countries_raw.json')))

const rawMembers = raw.filter((el) => {
  return el.unMember || addedMembers.includes(el.name.common)
})

const out = rawMembers.map((c) => {
  const country = { name: { common: c.name.common }, alpha2: c.cca2, alpha3: c.cca3 }

  if (addArticle.includes(country.name.common)) {
    country.name.article = 'The'
  }
  if (addPlural.includes(country.name.common)) {
    country.name.isPlural = true
  }
  if (nameSubs[c.name.common]) {
    country.name.common = nameSubs[c.name.common]
  }
  return country
})

fs.writeFileSync(path.join(__dirname, '../content/data/countries.json'), JSON.stringify(out, null, '  '))
