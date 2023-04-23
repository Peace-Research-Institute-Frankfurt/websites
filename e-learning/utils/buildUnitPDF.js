'use strict'

const fs = require('fs')
const puppeteer = require('puppeteer')
const express = require('express')
const pdfLib = require('pdf-lib')
const gm = require('gray-matter')

const app = express()
const port = 3000
console.log(`\nGenerating Unit PDFS...`)

// Find our which units we need to make PDFs for
const basePath = `./content/learning-units`
const units = fs.readdirSync(basePath)
// const units = ['lu-18']
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

app.use(express.static('./public'))

var server = app.listen(port, function (err) {
  if (err) console.log('Error in Webserver setup')
  console.log(`Listening http://localhost:${port}`)
})

async function setMetaData(unit, outputPath) {
  console.log(`Writing metadata for ${outputPath}...`)
  // We have to parse the original Markdown
  // again here to get the PDF metadata
  const frontmatter = gm.read(`./content/learning-units/${unit}/index.mdx`)

  // Load the unprocessed PDF
  const pdfData = fs.readFileSync(outputPath)
  const pdfDoc = await pdfLib.PDFDocument.load(pdfData)

  // Set metadata
  pdfDoc.setTitle(`[EUNPDC eLearning] ${frontmatter.data?.title}`, {
    showInWindowTitleBar: true,
    updateMetadata: true,
  })
  pdfDoc.setSubject(`${frontmatter.data?.intro}`)
  pdfDoc.setAuthor('Peace Research Institute Frankfurt')
  pdfDoc.setLanguage('en-EN')
  const bytes = await pdfDoc.save()
  fs.writeFileSync(outputPath, bytes)
}

;(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--export-tagged-pdf'] })
  const page = await browser.newPage()
  for (let i = 0; i < printUnits.length; i++) {
    const unit = printUnits[i]
    const outputPath = `./public/static/eunpdc-${unit}.pdf`
    // const outputPath = `./eunpdc-${unit}.pdf`
    console.log(`Generating PDF for ${unit}...`)
    await page.goto(`http://localhost:3000/${unit}/print`, { waitUntil: 'networkidle0' })
    await page.pdf({
      path: outputPath,
      format: 'A4',
      displayHeaderFooter: false,
      scale: 1,
      printBackground: true,
    })
    setMetaData(unit, outputPath)
  }
  await browser.close()
  await server.close(function () {
    console.log('Done.')
  })
})(server)
