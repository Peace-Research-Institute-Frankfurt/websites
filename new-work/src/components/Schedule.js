export default function Schedule({ from, to, children }) {
  const nowDate = new Date()
  const fromDate = from ? Date.parse(from) : false
  const toDate = to ? Date.parse(to) : false

  if ((!fromDate || fromDate < nowDate) && (!toDate || toDate > nowDate)) {
    return children
  }

  return null
}
