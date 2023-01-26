const fs = require('fs')
const formats = ['woff', 'woff2']
const cuts = ['', 'Italic']
const weights = [
  { name: 'Light', weight: 200 },
  { name: 'Regular', weight: 400 },
]
let output = ''

weights.forEach((weight) => {
  cuts.forEach((cut) => {
    formats.forEach((format) => {
      const rule = `
@font-face {
    font-family: "Suisse";
    src: url(./SuisseNeue-${weight.name}${cut}-WebS.${format}) format("${format}");
    font-weight: ${weight.weight};
    font-style: ${cut};
    font-display: swap;
}`
      output += rule
    })
  })
})

fs.writeFileSync('./static/fonts/suisse.css', output, null)
