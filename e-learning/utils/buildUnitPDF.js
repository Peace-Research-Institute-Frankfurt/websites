'use strict'

const fs = require('fs')
const puppeteer = require('puppeteer')
const { PDFDocument } = require('pdf-lib')
const express = require('express')
const { setOutline } = require('./setOutline')
const gm = require('gray-matter')

const locales = ['en', 'fr']
const defaultLocale = 'en'

console.log(`\nGenerating Unit PDFs...`)

let printUnits = []
let skippedUnits = []

locales.forEach((locale) => {
  const basePath = `./content/${locale}`

  if (!fs.existsSync(basePath)) {
    console.log(`Skipping locale "${locale}" (folder not found)`)
    return
  }

  const units = fs.readdirSync(basePath)
  units.forEach((unit) => {
    const unitPath = `${basePath}/${unit}`
    if (!fs.statSync(unitPath).isDirectory()) return

    const chapters = fs.readdirSync(unitPath)
    if (chapters.includes('__print.mdx')) {
      const urlPath = locale !== defaultLocale ? `${locale}/${unit}` : unit
      printUnits.push({ unit, locale, urlPath, contentPath: unitPath })
    } else {
      skippedUnits.push(`${locale}/${unit}`)
    }
  })
})

if (skippedUnits.length > 0) {
  console.log(`Skipping ${skippedUnits.join(', ')} (no print template found)`)
}

const app = express()
app.use(express.static('./public'))
const port = 3000

const server = app.listen(port, function (err) {
  if (err) console.log('Error in Webserver setup')
})

async function setMetaData({ unit, locale, contentPath }, outline, outputPath) {
  console.log(`Writing metadata...`)

  const frontmatter = gm.read(`${contentPath}/index.mdx`)
  const pdfData = fs.readFileSync(outputPath)
  const pdfDoc = await PDFDocument.load(pdfData)

  pdfDoc.setTitle(`[EUNPDC eLearning] ${frontmatter.data?.title}`, {
    showInWindowTitleBar: true,
    updateMetadata: true,
  })
  pdfDoc.setSubject(`${frontmatter.data?.intro}`)
  pdfDoc.setAuthor('Peace Research Institute Frankfurt')
  pdfDoc.setLanguage(`${locale}-${locale.toUpperCase()}`)

  setOutline(pdfDoc, outline)

  const bytes = await pdfDoc.save()
  fs.writeFileSync(outputPath, bytes)
}

;(async () => {
  for (let i = 0; i < printUnits.length; i++) {
    const unitEntry = printUnits[i]
    const { unit, locale, urlPath } = unitEntry
    const outputPath = `./public/static/eunpdc-${locale}-${unit}.pdf`

    console.log(`\nBuilding "${locale}/${unit}"...`)

    const os = require('os')
    const path = require('path')

    const userDataDir = path.join(os.tmpdir(), `puppeteer-${locale}-${unit}-${Date.now()}`)

    const browser = await puppeteer.launch({
      headless: 'old',
      args: [
        '--no-sandbox',
        '--export-tagged-pdf', 
        '--disable-gpu',
        '--disable-dev-shm-usage', //verhindert Speicherprobleme
        '--memory-pressure-off',
      ],
      userDataDir,
    })
    const page = await browser.newPage()
    page.on('console', (msg) => console.log('PAGE:', msg.text()))

    try {
      await page.goto(`http://localhost:3000/${urlPath}/print`, {
        waitUntil: 'networkidle0',
        timeout: 120000,
      })
      await page.waitForSelector('.tocPage', { timeout: 60000 })

      const tocContainer = await page.$('.toc')
      const tocEls = await tocContainer.$$('.toc li a')

      const outline = []
      for (let j = 0; j < tocEls.length; j++) {
        const el = tocEls[j]
        const pageNumber = await page.evaluate((el) => parseInt(el.getAttribute('data-page')), el)
        const title = await page.evaluate((el) => el.getAttribute('data-label'), el)
        outline.push({ title, page: pageNumber })
      }

      const pdfBuffer = await page.pdf({
        format: 'A4',
        displayHeaderFooter: false,
        scale: 1,
        printBackground: true,
      })
      fs.writeFileSync(outputPath, pdfBuffer)

      await setMetaData(unitEntry, outline, outputPath)
    } catch (err) {
      console.error(`\nError building "${locale}/${unit}": ${err.message}`)
    } finally {
      try {
        await browser.close()
      } catch (e) {
        console.error(`Browser close error: ${e.message}`)
      }
      // Kurz warten damit Windows die Temp-Dateien freigeben kann
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  }

  await server.close()
})(server)