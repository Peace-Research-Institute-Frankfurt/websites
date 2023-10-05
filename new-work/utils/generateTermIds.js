const fs = require('fs')
const slug = require('slug')

const terms = JSON.parse(fs.readFileSync('./content/data/terms.json'))
let output = []

terms.forEach((t) => {
  output.push({ ...t, term_id: slug(t.title) })
})

// console.log(output)
fs.writeFileSync('./content/data/terms.json', JSON.stringify(output, null, '  '), null)
