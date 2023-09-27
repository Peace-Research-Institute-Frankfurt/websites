// This script uses Puppeteer to scrape treaty participants
// and the dates of the signatures/accession/ratification/etc.
// from https://treaties.un.org into /content/data/treaties.json.

// It's additive, which means we can still edit treaties.json
// manually and this script won't overwrite our changes.

import { DateTime } from 'luxon'
import puppeteer from 'puppeteer'
import { diff } from 'just-diff'
import { exit } from 'process'

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

import scrapeUNTreaty from './scrapers/unTreaty.mjs'
import scrapeUNODATreaty from './scrapers/unodaTreaty.mjs'

const treatiesFile = path.join(__dirname, '../content/data/treaties.json')
const countries = JSON.parse(fs.readFileSync(path.join(__dirname, '../content/data/countries.json')))
const treaties = JSON.parse(fs.readFileSync(treatiesFile))

const nameSubs = {
  Türkiye: 'Turkey',
  'Bolivia (Plurinational State of)': 'Bolivia',
  'Brunei Darussalam': 'Brunei',
  'Cabo Verde': 'Cape Verde',
  Congo: 'Republic of the Congo',
  "Côte d'Ivoire": 'Ivory Coast',
  'Czech Republic': 'Czechia',
  'Holy See': 'Vatican City',
  'Iran (Islamic Republic of)': 'Iran',
  "Lao People's Democratic Republic": 'Laos',
  'Micronesia (Federated States of)': 'Micronesia',
  'Republic of Korea': 'South Korea',
  "Democratic People's Republic of Korea": 'North Korea',
  'Republic of Moldova': 'Moldova',
  'Russian Federation': 'Russia',
  'Sao Tome and Principe': 'São Tomé and Príncipe',
  'St. Kitts and Nevis': 'Saint Kitts and Nevis',
  'St. Lucia': 'Saint Lucia',
  'St. Vincent and the Grenadines': 'Saint Vincent and the Grenadines',
  'State of Palestine': 'Palestine',
  'Syrian Arab Republic': 'Syria',
  'United Kingdom of Great Britain and Northern Ireland': 'United Kingdom',
  'United Republic of Tanzania': 'Tanzania',
  'United States': 'United States of America',
  'Venezuela (Bolivarian Republic of)': 'Venezuela',
  'Venezuela, Bolivarian Republic of': 'Venezuela',
  'Viet Nam': 'Vietnam',
  'Netherlands (Kingdom of the)': 'Netherlands',
}

let out = []

const pages = treaties.filter((el) => el.scrapeURL)
console.log(`Found ${pages.length} treaties with scrapeURLs, running scrapers...`)

for (let i = 0; i < pages.length; i++) {
  const p = pages[i]
  let treaty = { ...p }

  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()

  page.on('console', async (msg) => {
    const msgArgs = msg.args()
    for (let i = 0; i < msgArgs.length; ++i) {
      console.log(await msgArgs[i].jsonValue())
    }
  })
  await page.goto(p.scrapeURL)
  let participants = []

  if (p.scrapeURL.includes('treaties.un.org')) {
    console.log(`Updating ${treaty.name.toUpperCase()} (UNTC, ${p.scrapeURL})`)
    participants = await scrapeUNTreaty(page)
  }
  if (p.scrapeURL.includes('treaties.unoda.org')) {
    console.log(`Updating ${treaty.name.toUpperCase()} (UNODA, ${p.scrapeURL})`)
    participants = await scrapeUNODATreaty(page)
  }

  await browser.close()

  // fs.writeFileSync(path.join(__dirname, `./tmp-${treaty.name}.json`), JSON.stringify(participants, null, '  '))
  // const participants = JSON.parse(fs.readFileSync(path.join(__dirname, `./tmp-${treaty.name}.json`)))

  console.log(`Found ${participants.length} treaty participants`)

  const treatyParticipants = participants.map((p) => {
    // Find the corresponding country in countries.json
    const country = countries.find((c) => c.name.common === (nameSubs[p.name] || p.name))
    if (!country) {
      console.log(`Could not find country ${p.name}`)
      return []
    }
    // Sort events by date
    let events = [...p.events]
    events.sort((a, b) => {
      return DateTime.fromISO(a.date) - DateTime.fromISO(b.date)
    })

    return { country: country.alpha3, events: events }
  })

  treaty.participants = treatyParticipants
  out.push(treaty)
}

const differences = diff(treaties, out)

if (differences.length === 0) {
  console.log(`All treaties are up-to-date.`)
  exit(2)
} else {
  fs.writeFileSync(treatiesFile, `${JSON.stringify(out, null, '  ')}\n`, 'utf-8')
  console.log(`Wrote new data to ${treatiesFile}`)
  exit(0)
}
