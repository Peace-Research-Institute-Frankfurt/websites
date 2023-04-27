'use strict'

const fs = require('fs')
const puppeteer = require('puppeteer')
const { PDFDict, PDFNull, PDFNumber, PDFString, PDFName, PDFArray, PDFDocument } = require('pdf-lib')
const express = require('express')
const gm = require('gray-matter')

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

const app = express()
app.use(express.static('./public'))
const port = 3000

var server = app.listen(port, function (err) {
  if (err) console.log('Error in Webserver setup')
  console.log(`Listening http://localhost:${port}`)
})

const createOutlineItem = (pdfDoc, title, parent, nextOrPrev, page, isLast = false) => {
  let array = PDFArray.withContext(pdfDoc.context)

  array.push(page)
  array.push(PDFName.of('XYZ'))
  array.push(PDFNull)
  array.push(PDFNull)
  array.push(PDFNull)

  const map = new Map()
  map.set(PDFName.Title, PDFString.of(title))
  map.set(PDFName.Parent, parent)
  map.set(PDFName.of(isLast ? 'Prev' : 'Next'), nextOrPrev)
  map.set(PDFName.of('Dest'), array)

  return PDFDict.fromMapWithContext(map, pdfDoc.context)
}

const setOutline = function (doc, outline) {
  const pageRefs = []

  // Traverse our doc's page tree
  // https://github.com/Hopding/pdf-lib/blob/b8a44bd24b74f4f32456e9809dc4d2d9dc9bf176/src/core/structures/PDFPageTree.ts
  doc.catalog.Pages().traverse((kid, kidRef) => {
    // Kid is either a PageTree or PageLeaf
    if (kid.get(kid.context.obj('Type'))?.toString() === '/Page') {
      pageRefs.push(kidRef)
    }
  })

  // const structTreeRoot = pdfDoc.catalog.lookup(PDFName.of('StructTreeRoot'));

  // 2. Make an outline object and add that to the document
  // const outline = [{ title: 'test1' }, { title: 'test2' }, { title: 'test3' }]
  const outlinesDictRef = doc.context.nextRef()
  const outlineItems = []

  // Loop to set Refs
  outline.forEach((el, i) => {
    el.ref = doc.context.nextRef()
  })

  outline.forEach((el, i) => {
    const isLast = i === outline.length - 1
    let nextPrev = null
    if (outline.length === 1) {
      nextPrev = outline[0].ref
    } else {
      nextPrev = !isLast ? outline[i + 1].ref : outline[i - 1].ref
    }
    const outlineItem = createOutlineItem(doc, el.title, outlinesDictRef, nextPrev, pageRefs[el.page - 1], isLast)
    outlineItems.push(outlineItem)
  })

  const outlinesDictMap = new Map()
  outlinesDictMap.set(PDFName.Type, PDFName.of('Outlines'))
  outlinesDictMap.set(PDFName.of('First'), outline[0].ref)
  outlinesDictMap.set(PDFName.of('Last'), outline[outline.length - 1].ref)
  outlinesDictMap.set(PDFName.of('Count'), PDFNumber.of(outline.length))

  //Pointing the "Outlines" property of the PDF's "Catalog" to the first object of your outlines
  doc.catalog.set(PDFName.of('Outlines'), outlinesDictRef)
  const outlinesDict = PDFDict.fromMapWithContext(outlinesDictMap, doc.context)

  // See table H.3, Annex H.6, PDF Spec
  doc.context.assign(outlinesDictRef, outlinesDict)

  outline.forEach((el, i) => {
    doc.context.assign(el.ref, outlineItems[i])
  })
}

async function setMetaData(unit, outline, outputPath) {
  console.log(`Writing metadata for ${outputPath}...`)

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

  setOutline(pdfDoc, outline)

  const bytes = await pdfDoc.save()
  fs.writeFileSync(outputPath, bytes)
}

;(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--export-tagged-pdf'] })
  const page = await browser.newPage()

  page.on('console', (msg) => console.log('PAGE LOG:', msg.text()))

  for (let i = 0; i < printUnits.length; i++) {
    const unit = printUnits[i]
    const outputPath = `./public/static/eunpdc-${unit}.pdf`
    // const outputPath = `./eunpdc-${unit}.pdf`

    console.log(`Generating PDF for ${unit}...`)

    await page.goto(`http://localhost:3000/${unit}/print`, { waitUntil: 'networkidle0' })
    await page.waitForSelector('.tocPage')

    const tocContainer = await page.$('.toc')
    const tocEls = await tocContainer.$$('.toc li a')

    const outline = []
    for (let i = 0; i < tocEls.length; i++) {
      const text = await page.evaluate((el) => el.innerText, tocEls[i])
      const pageEl = await tocEls[i].$('.tocPage')
      const pageNumber = await page.evaluate((el) => el.innerText, pageEl)
      outline.push({ title: text, page: parseInt(pageNumber) })
    }

    console.log(outline)

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
  await server.close(function () {
    console.log('Done.')
  })
})(server)
