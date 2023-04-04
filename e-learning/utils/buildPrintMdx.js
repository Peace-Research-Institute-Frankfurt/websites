// This script generates a file called __print.mdx for each
// unit, which simply imports all chapters and renders them.
// This is a workaround to be able to transform multiple
// MDX files into a single HTML page for printing them.

const fs = require('fs')
const gm = require('gray-matter')
const basePath = `../content/learning-units`

// const units = fs.readdirSync(basePath)
const units = ['lu-18']
units.forEach((unit) => {
  const chapters = fs.readdirSync(`${basePath}/${unit}`)
  let unitData = []

  chapters.forEach((chapter) => {
    if (chapter !== 'index.mdx' && chapter !== 'assets' && chapter !== '__print.mdx') {
      const chapterPath = `${basePath}/${unit}/${chapter}`
      const content = fs.readFileSync(chapterPath)
      console.log(`Parsing ${chapter}`)
      const frontmatter = gm(content)
      if (frontmatter.data.title) {
        unitData.push({
          filename: chapter,
          data: frontmatter.data,
        })
      }
    }
  })

  // Generate output
  output = `import Chapter from '../../../src/components/PrintChapter.js'

${unitData
  .map((chapter, i) => {
    return `import Chapter${i} from './${chapter.filename}'`
  })
  .join('\n')}

${unitData
  .map((chapter, i) => {
    return `
<Chapter title="${chapter.data.title}" intro="${chapter.data.intro}">
  <Chapter${i} />
</Chapter>`
  })
  .join('\n')}
  `

  // Write the output
  fs.writeFileSync(`${basePath}/${unit}/__print.mdx`, output)
})
