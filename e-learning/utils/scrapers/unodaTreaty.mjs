import { DateTime } from 'luxon'

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const eventTypes = {
  Accession: 'accession',
  Acceptance: 'acceptance',
  Succession: 'succession',
  signature: 'signature',
  Ratification: 'ratification',
}

const dateFormat = 'd MMMM yyyy'

export default async function scrapeUNODATreaty(page) {
  const container = await page.waitForSelector('.mat-tab-body-content .mat-table')

  const participants = await container.evaluate((el, eventTypes) => {
    const participants = []

    // Slice off the header row
    const rows = Array.from(el.querySelectorAll('mat-row'))

    rows.forEach((row) => {
      const cells = row.querySelectorAll('mat-cell')
      const countryEl = cells[0]
      const signatureDateEl = cells[1]
      const depositDateEl = cells[3]
      const depositTypeEl = cells[5]

      const events = []

      // Is the country a signatory?

      if (signatureDateEl.innerText.trim() !== '') {
        const dateStrings = signatureDateEl.innerText.trim().match(/\d{1,2} \w+ \d{4}/g)
        events.push({ type: 'signature', dates: dateStrings })
      }

      if (depositDateEl.innerText.trim() !== '') {
        const dateStrings = depositDateEl.innerText.trim().match(/\d{1,2} \w+ \d{4}/g)
        const depositType = depositTypeEl.innerText.trim().match(/^\w+/g)[0]
        events.push({ type: depositType || '', dates: dateStrings })
      }

      participants.push({
        name: countryEl.innerText.replace(/(\d)|(\\n)/g, '').trim(),
        events: events,
      })
    })
    return participants
  })

  // fs.writeFileSync(path.join(__dirname, `./tmp-unoda.json`), JSON.stringify(participants, null, '  '))
  // const participants = JSON.parse(fs.readFileSync(path.join(__dirname, './tmp-unoda.json')))

  // Normalise dates and event types
  participants.forEach((p) => {
    const events = p.events.map((e, i) => {
      const eventType = eventTypes[e.type] || `Unknown treaty event type (${e.type})`

      // This source occasionally lists multiple event dates, we'll take the earliest one
      e.dates.sort((a, b) => {
        return DateTime.fromFormat(a, dateFormat) - DateTime.fromFormat(b, dateFormat)
      })

      const eventDate = DateTime.fromFormat(e.dates[0], dateFormat).toFormat('yyyy-MM-dd')
      return { type: eventType, date: eventDate }
    })

    // Solves an edge case where signature an ratification fall on the same date,
    // but end up in the wrong order
    p.events = events.sort((a, b) => {
      if (a.date === b.date) {
        return b.type.localeCompare(a.type)
      }
      return 0
    })
  })

  // This source occasionally list the same participants
  // multiple times. We normalise this by merging their
  // event histories and discarding duplicate events

  let uniqueParticipants = []

  for (let i = 0; i < participants.length; i++) {
    const p = participants[i]
    const ui = uniqueParticipants.findIndex((el) => {
      return el.name === p.name
    })
    if (ui !== -1) {
      uniqueParticipants[ui].events = [...uniqueParticipants[ui].events, ...participants[i].events]
    } else {
      uniqueParticipants.push(p)
    }
  }

  for (let i = 0; i < uniqueParticipants.length; i++) {
    const seenEvents = new Set()
    uniqueParticipants[i].events = uniqueParticipants[i].events.filter((e) => {
      let k = `${e.type}/${e.date}`
      return seenEvents.has(k) ? false : seenEvents.add(k)
    })
    uniqueParticipants[i].events = [...new Set(uniqueParticipants[i].events)]
  }

  return uniqueParticipants
}
