'use strict'

const fs = require('fs')
const puppeteer = require('puppeteer')
const { PDFDocument } = require('pdf-lib')
const express = require('express')
const { setOutline } = require('./setOutline')
const gm = require('gray-matter')

console.log(`\nGenerating Unit PDFs...`)

// Find our which units we need to make PDFs for
const basePath = `./content/learning-units`

// const units = fs.readdirSync(basePath)
const units = ['lu-18']

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

const app = express()
app.use(express.static('./public'))
const port = 3000

var server = app.listen(port, function (err) {
  if (err) console.log('Error in Webserver setup')
})

async function setMetaData(unit, outline, outputPath) {
  console.log(`Writing metadata...`)

  // Parse the original Markdown for the unit metadata
  const frontmatter = gm.read(`./content/learning-units/${unit}/index.mdx`)

  // Load the unprocessed PDF
  const pdfData = fs.readFileSync(outputPath)
  const pdfDoc = await PDFDocument.load(pdfData)

  // Set metadata
  pdfDoc.setTitle(`[EUNPDC eLearning] ${frontmatter.data?.title}`, {
    showInWindowTitleBar: true,
    updateMetadata: true,
  })
  pdfDoc.setSubject(`${frontmatter.data?.intro}`)
  pdfDoc.setAuthor('Peace Research Institute Frankfurt')
  pdfDoc.setLanguage('en-EN')

  // Set PDF document outlines
  setOutline(pdfDoc, outline)

  const bytes = await pdfDoc.save()
  fs.writeFileSync(outputPath, bytes)
}

;(async () => {
  const browser = await puppeteer.launch({
    headless: 'old', // --export-tagged-pdf doesn't work in new headless
    args: ['--no-sandbox', '--export-tagged-pdf'],
  })
  const page = await browser.newPage()

  page.on('console', (msg) => console.log('PAGE:', msg.text()))

  for (let i = 0; i < printUnits.length; i++) {
    const unit = printUnits[i]
    // const outputPath = `./public/static/eunpdc-${unit}.pdf`
    const outputPath = `./eunpdc-${unit}.pdf`

    console.log(`\nBuilding "${unit}"...`)

    await page.goto(`http://localhost:3000/${unit}/print`, { waitUntil: 'networkidle0' })
    await page.waitForSelector('.tocPage')

    const tocContainer = await page.$('.toc')
    const tocEls = await tocContainer.$$('.toc li a')

    const outline = []
    for (let i = 0; i < tocEls.length; i++) {
      const el = tocEls[i]
      const pageNumber = await page.evaluate((el) => parseInt(el.getAttribute('data-page')), el)
      const title = await page.evaluate((el) => el.getAttribute('data-label'), el)
      outline.push({ title: title, page: pageNumber })
    }

    await page.pdf({
      path: outputPath,
      format: 'A4',
      displayHeaderFooter: false,
      scale: 1,
      printBackground: true,
    })

    setMetaData(unit, outline, outputPath)
  }
  await browser.close()
  await server.close()
})(server)
