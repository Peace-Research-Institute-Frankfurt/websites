// This script uses Puppeteer to scrape basic arms transfer
// data from https://www.sipri.org/databases/armstransfers

import puppeteer from 'puppeteer'
import { diff } from 'just-diff'
import { exit } from 'process'

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const START_YEAR = 2005
const END_YEAR = 2010

const dataFile = path.join(__dirname, '../content/data/arms-transfers.json')
const countries = JSON.parse(fs.readFileSync(path.join(__dirname, '../content/data/countries.json')))
const oldTransfers = JSON.parse(fs.readFileSync(dataFile))

let newTransfers = []

console.log(`Updating SIPRI arms transfer data`)

const browser = await puppeteer.launch({ headless: 'new' })

const page = await browser.newPage()

page.on('console', async (msg) => {
  const msgArgs = msg.args()
  for (let i = 0; i < msgArgs.length; ++i) {
    console.log(await msgArgs[i].jsonValue())
  }
})

await page.goto('https://armstrade.sipri.org/armstrade/page/values.php')

await page.locator('input[name=import_or_export][value="export"]').click()
await page.select('select[name=low_year]', `${START_YEAR}`)
await page.select('select[name=high_year]', `${END_YEAR}`)
await page.locator('input[name=summarize][value="country"]').click()
await page.locator('input[name=filetype][value="html"]').click()
await page.locator('input[type=submit]').click()

await page.waitForNavigation()

const containerEl = await page.waitForSelector('.csvtable')

const totals = await containerEl.evaluate((el) => {
  const totals = Array.from(el.querySelectorAll('tbody tr:last-child td'))
    .slice(1, -1)
    .map((el) => {
      return el.innerText
    })
  return totals
})

await browser.close()

newTransfers = totals.map((el, i) => {
  return { year: START_YEAR + i, value: parseFloat(el) }
})

const differences = diff(oldTransfers, newTransfers)

if (differences.length === 0) {
  console.log(`No changes found.`)
  exit(2)
} else {
  fs.writeFileSync(dataFile, `${JSON.stringify(newTransfers, null, '  ')}\n`, 'utf-8')
  console.log(`New data found, writing to ${dataFile}`)
  exit(0)
}
