// This script generates a file called __print.mdx for each
// unit, which simply imports all chapters and renders them.
// This is a workaround to be able to transform multiple MDX
// files into a single HTML page for printing them.
// See https://github.com/gatsbyjs/gatsby/discussions/37301

const fs = require('fs')
const gm = require('gray-matter')
const basePath = `./content/learning-units`

console.log('Generating print templates... ')

const units = fs.readdirSync(basePath)
units.forEach((unit) => {
  const chapters = fs.readdirSync(`${basePath}/${unit}`)
  const hasChapters = chapters.length > 0
  let unitData = []

  if (hasChapters) {
    chapters.forEach((chapter) => {
      if (chapter === 'index.mdx') {
        const chapterPath = `${basePath}/${unit}/${chapter}`
        const frontmatter = gm.read(chapterPath)
      }
      if (chapter !== 'index.mdx' && chapter !== 'assets' && chapter !== '__print.mdx') {
        const chapterPath = `${basePath}/${unit}/${chapter}`
        const frontmatter = gm.read(chapterPath)
        if (frontmatter.data.title) {
          unitData.push({
            filename: chapter,
            data: frontmatter.data,
          })
        }
      }
    })

    // Sort files by "order" frontmatter parameter
    unitData.sort((a, b) => {
      if (a.data.order > b.data.order) return 1
      if (a.data.order < b.data.order) return -1
      return 0
    })

    // Generate output
    output = `${unitData
      .map((chapter, i) => {
        return `import Chapter${i} from './${chapter.filename}'`
      })
      .join('\n')}

${unitData
  .map((chapter, i) => {
    return `<Chapter title="${chapter.data.title}" intro="${chapter.data.intro}" order="${chapter.data.order}">
  <Chapter${i} />
</Chapter>`
  })
  .join('\n')}
`

    // Write the output
    fs.writeFileSync(`${basePath}/${unit}/__print.mdx`, output)
    console.log(`Wrote ${unit}`)
  } else {
    console.log(`Skipped ${unit} (no chapters found)`)
  }
})

console.log(`Done\n`)
