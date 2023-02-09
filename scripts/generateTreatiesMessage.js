// This script takes two treaties.json files, compares them
// and writes a nicely-formatted PR message to /tmp

import * as fs from 'fs'
import minimist from 'minimist'
import { exit } from 'process'
import { diff } from 'just-diff'
const args = minimist(process.argv.slice(2))

if (!args.base) {
  console.log(`Missing argument --base`)
  exit(1)
}
if (!args.head) {
  console.log(`Missing argument --head`)
  exit(1)
}

console.log('Generating PR description...')

const base = JSON.parse(fs.readFileSync(args.base))
const head = JSON.parse(fs.readFileSync(args.head))
const countryData = JSON.parse(fs.readFileSync(args.countryData))

const differences = diff(base, head)

const friendlyDiff = { treaties: [] }
let errorMessage = ''
try {
  differences.forEach((d) => {
    // May as well get meta data from head
    const headTreaty = head[d.path[0]]
    const headCountry = headTreaty.participants[d.path[2]]
    const headCountryData = countryData.find((el) => el.cca2 === headCountry.cca2)

    const baseTreaty = base.find((el) => el.name === headTreaty.name)
    const baseCountry = baseTreaty.participants.find((el) => el.cca2 === headCountry.cca2)
    //   const baseCountryData = countryData.find((el) => el.cca2 === baseCountry.cca2)
    let message = ''
    let eventMessages = []
    let countryMessage = ''

    if (d.op === 'add' && d.path.includes('participants') && d.path.length === 3) {
      countryMessage = `Added participant: ${headCountryData?.name?.common || headCountry.cca2}`
      eventMessages = d.value.events.map((e) => `Added \`${e.type} on ${e.date}\` `)
    } else if (d.op === 'add' && d.path.includes('events') && d.path[4]) {
      message = `Added: \`${d.value.type} on ${d.value.date}\``
      eventMessages = [`Added: \`${d.value.type} on ${d.value.date}\``]
    } else if (d.op === 'replace' && d.path.includes('events') && d.path[4]) {
      const baseEvent = baseCountry.events[d.path[4]]
      const headEvent = headCountry.events[d.path[4]]
      message = `Modified: \`${baseEvent.type} on ${baseEvent.date}\` is now \`${headEvent.type} on ${headEvent.date}\``
      eventMessages = [`Modified: \`${baseEvent.type} on ${baseEvent.date}\` is now \`${headEvent.type} on ${headEvent.date}\``]
    } else if (d.op === 'remove' && d.path.includes('events') && d.path[4]) {
      const baseEvent = baseCountry.events[d.path[4]]
      message = `Removed: \`${baseEvent.type} on ${baseEvent.date}\``
      eventMessages = [`Removed: \`${baseEvent.type} on ${baseEvent.date}\``]
    }

    const ti = friendlyDiff.treaties.findIndex((el) => el.name === headTreaty.name)
    if (ti === -1) {
      friendlyDiff.treaties.push({
        name: headTreaty.name,
        title: headTreaty.title,
        countries: [{ cca2: headCountry.cca2, title: headCountryData.name.common, countryMessage: countryMessage, changes: eventMessages }],
      })
    } else {
      const ci = friendlyDiff.treaties[ti].countries.findIndex((el) => el.cca2 === headCountry.cca2)
      if (ci === -1) {
        friendlyDiff.treaties[ti].countries.push({
          cca2: headCountry.cca2,
          title: headCountryData?.name?.common,
          countryMessage: countryMessage,
          changes: eventMessages,
        })
      } else {
        friendlyDiff.treaties[ti].countries[ci].changes = [...friendlyDiff.treaties[ti].countries[ci].changes, eventMessages]
      }
    }
  })
} catch {
  errorMessage = `Could not generate automated summary, maybe due to a treaty participant being removed.`
}

let copy = ''
friendlyDiff.treaties.forEach((treaty) => {
  copy += `- **${treaty.shortTitle || treaty.title || treaty.name}**\n`
  treaty.countries.forEach((country) => {
    copy += `  - ${country.countryMessage || country.title || country.cca2}\n`
    country.changes.forEach((change) => {
      copy += `    - ${change}\n`
    })
  })
})

const body = `
Updates the lists of UN treaty participants used in EUNPDC E-Learning.

## Changes

${errorMessage || copy}

This PR is auto-generated, so please double-check that these changes are correct before merging it. Also note that the summary above may not reflect all changes in this PR – use the \`Files Changed\` tab to make sure nothing unexpected is going on.`

if (!fs.existsSync('./tmp')) {
  console.log('Creating tmp directory...')
  fs.mkdirSync('./tmp')
}
console.log('Writing PR description to ./tmp/pr.md')
fs.writeFileSync('./tmp/pr.md', body)
