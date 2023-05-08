const { PDFDict, PDFNull, PDFNumber, PDFString, PDFName, PDFArray, PDFDocument } = require('pdf-lib')

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
    if (kid.get(kid.context.obj('Type'))?.toString() === '/Page') {
      pageRefs.push(kidRef)
    }
  })

  // 2. Make an outline object and add that to the document
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
  const outlinesDict = PDFDict.fromMapWithContext(outlinesDictMap, doc.context)
  doc.catalog.set(PDFName.of('Outlines'), outlinesDictRef)
  doc.context.assign(outlinesDictRef, outlinesDict)

  outline.forEach((el, i) => {
    doc.context.assign(el.ref, outlineItems[i])
  })
}

module.exports = { setOutline }
