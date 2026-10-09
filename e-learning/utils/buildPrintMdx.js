// This script generates a file called __print.mdx for each
// unit, which simply imports all chapters and renders them.
// This is a workaround to be able to transform multiple MDX
// files into a single HTML page for printing them.
// See https://github.com/gatsbyjs/gatsby/discussions/37301

const fs = require('fs')
const gm = require('gray-matter')

const locales = ['en', 'fr']

console.log('Generating print templates... ')

locales.forEach((locale) => {
  const basePath = `./content/${locale}`

  if (!fs.existsSync(basePath)) {
    console.log(`Skipping locale "${locale}" (folder not found)`)
    return
  }

  console.log(`\nProcessing locale "${locale}"...`)

  const units = fs.readdirSync(basePath)
  units.forEach((unit) => {
    const unitPath = `${basePath}/${unit}`

    if (!fs.statSync(unitPath).isDirectory()) return

    const chapters = fs.readdirSync(unitPath)
    const hasChapters = chapters.length > 0
    let unitData = []

    if (hasChapters) {
      chapters.forEach((chapter) => {
        if (chapter !== 'index.mdx' && chapter !== 'assets' && chapter !== '__print.mdx') {
          const chapterPath = `${unitPath}/${chapter}`
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
      const output = `${unitData
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
      fs.writeFileSync(`${unitPath}/__print.mdx`, output)
      console.log(`Wrote ${locale}/${unit}`)
    } else {
      console.log(`Skipped ${locale}/${unit} (no chapters found)`)
    }
  })
})

console.log(`Done\n`)
