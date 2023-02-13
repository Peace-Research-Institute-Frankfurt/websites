import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const raw = JSON.parse(fs.readFileSync(path.join(__dirname, './countries_raw.json')))

const rawMembers = raw.filter((el) => {
  return el.unMember || el.name.common === 'Cook Islands' || el.name.common === 'Niue'
})

const nameSubs = { 'DR Congo': 'Democratic Republic of the Congo' }
const addArticle = ['Netherlands', 'United States', 'United Arab Emirates', 'United Kingdom', 'Central African Republic', 'Dominican Republic']

const out = rawMembers.map((c) => {
  const country = { name: { common: c.name.common }, alpha2: c.cca2, alpha3: c.cca3 }

  if (nameSubs[c.name.common]) {
    country.name.common = nameSubs[c.name.common]
  }

  if (addArticle.includes(country.name.common)) {
    country.name.article = 'The'
  }
  return country
})

fs.writeFileSync(path.join(__dirname, '../content/data/countries.json'), JSON.stringify(out, null, '  '))
