// cd public
// pagedjs-cli ./lu-18/print/index.html -o result.pdf --page-size a4 --media print --outline-tags h1,h2,h3,h4,h5 --style "print.css" --browserArgs "" -d

// Start express, serve /public
// Start puppeteer, navigate to each unit print view
// Wait for js to run
// Generate PDF

// Can probably do this in parallel!
'use strict'

const fs = require('fs')
const puppeteer = require('puppeteer')
const express = require('express')

const app = express()
const port = 3000
console.log(`\nGenerating Unit PDFS...`)

// Find our which units we need to make PDFs for
const basePath = `./content/learning-units`
const units = fs.readdirSync(basePath)
let printUnits = []
let skippedUnits = []
units.forEach((unit) => {
  const chapters = fs.readdirSync(`${basePath}/${unit}`)
  if (chapters.includes('__print.mdx')) {
    printUnits.push(unit)
  } else {
    skippedUnits.push(unit)
  }
})

if (skippedUnits.length > 0) {
  console.log(`Skipping ${skippedUnits.join(', ')} (no print template found)`)
}

app.use(express.static('public'))

var server = app.listen(port, function (err) {
  if (err) console.log('Error in Webserver setup')
  console.log(`Listening http://localhost:${port}`)
})

;(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--export-tagged-pdf'] })
  const page = await browser.newPage()
  for (let i = 0; i < printUnits.length; i++) {
    const unit = printUnits[i]
    console.log(`Generating PDF for ${unit}...`)
    await page.goto(`http://localhost:3000/${unit}/print`, { waitUntil: 'networkidle0' })
    await page.pdf({
      path: `./public/static/eunpdc-${unit}.pdf`,
      format: 'A4',
      displayHeaderFooter: false,
      scale: 1,
      printBackground: true,
    })
  }
  await browser.close()
  await server.close(function () {
    console.log('Done.')
  })
})(server)
