// Source: https://stackoverflow.com/a/22021709

function unicodeToChar(text) {
  return text.replace(/\\u[\dA-F]{4}/gi, function (match) {
    return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16))
  })
}

export { unicodeToChar }
