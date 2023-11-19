import { DateTime } from 'luxon'

const eventTypes = {
  a: 'accession',
  A: 'acceptance',
  d: 'succession',
  signature: 'signature',
  ratification: 'ratification',
}

const dateFormat = 'd MMM yyyy'

export default async function scrapeUNTreaty(page) {
  const container = await page.waitForSelector('#participants')

  const participants = await container.evaluate((el, eventTypes) => {
    const participants = []

    // Slice off the header row
    const rows = Array.from(el.querySelectorAll('tr')).slice(1)

    rows.forEach((row) => {
      const [countryEl, signedEl, treatyEventEl] = row.querySelectorAll('td')
      const events = []

      // Is the country a signatory?
      if (signedEl.innerText.trim() !== '') {
        events.push({ type: 'signature', date: signedEl.innerText.trim().replace('\n', '') })
      }

      // Has the country ratified/accepted/etc. the treaty?
      if (treatyEventEl.innerText.trim() !== '') {
        const matches = treatyEventEl.innerText.trim().match(/(\d+ [a-zA-Z]+ \d+) ?([a-zA-Z]?)/)
        let eventType = 'ratification'
        let eventDate = ''
        if (matches && matches[1]) {
          eventDate = matches[1]
        }
        if (matches && matches[2]) {
          eventType = matches[2]
        }
        events.push({ type: eventType, date: eventDate })
      }
      participants.push({
        name: countryEl.innerText.replace(/(\d)|(\\n)/g, '').trim(),
        events: events,
      })
    })
    return participants
  }, eventTypes)

  // Normalise event types and dates
  participants.forEach((p) => {
    p.events.forEach((e, i, arr) => {
      const eventType = eventTypes[e.type] || `Unknown treaty event type (${e.type})`
      const eventDate = DateTime.fromFormat(e.date, dateFormat).toFormat('yyyy-MM-dd')
      arr[i] = { type: eventType, date: eventDate }
    })
  })

  return participants
}
