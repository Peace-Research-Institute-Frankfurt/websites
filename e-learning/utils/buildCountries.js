import fs from 'fs'
const raw = JSON.parse(fs.readFileSync('./countries_raw.json'))

const out = raw.flatMap((c) => {
  if (c.independent) {
    return {
      name: {
        common: c.name.common,
        official: c.name.common,
      },
      cca2: c.cca2,
      unMember: c.unMember,
    }
  }
  return []
})

fs.writeFileSync('../content/data/countries.json', JSON.stringify(out, null, '  '))
