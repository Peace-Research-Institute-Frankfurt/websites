import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const raw = JSON.parse(fs.readFileSync(path.join(__dirname, './countries_raw.json')))

const out = raw.flatMap((c) => {
  return {
    name: {
      common: c.name.common,
      official: c.name.common,
    },
    cca2: c.cca2,
    unMember: c.unMember,
  }
  // return []
})

fs.writeFileSync(path.join(__dirname, '../content/data/countries.json'), JSON.stringify(out, null, '  '))
