const fs = require('fs')
const slug = require('slug')

// This is a utility script that normalises ids and sorts entries
// in content/data/terms.json

const terms = JSON.parse(fs.readFileSync('./content/data/terms.json'))
let output = []

terms.forEach((t) => {
  output.push({ ...t, term_id: slug(t.title) })
})

output.sort((a, b) => {
  return a.title > b.title ? 1 : a.title < b.title ? -1 : 0
})

fs.writeFileSync('./content/data/terms.json', JSON.stringify(output, null, '  '), null)
