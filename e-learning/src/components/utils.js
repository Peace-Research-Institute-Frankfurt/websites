const clamp = (n, min, max) => Math.min(Math.max(n, min), max)

/**
 * Truncates a string to a given number of words.
 * @param {String} s
 * @param {Number} length
 * @returns {String}
 */
const truncate = (s, length) => {
  const words = s.split(' ')
  if (words.length <= length) {
    return s
  } else {
    return `${words.slice(0, length).join(' ')}...`
  }
}

export { clamp, truncate }
