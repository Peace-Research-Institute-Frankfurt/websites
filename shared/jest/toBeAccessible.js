'use strict'

const aChecker = require('accessibility-checker')

async function toBeAccessible(node, label) {
  console.error = () => {}
  let results = await aChecker.getCompliance(node, label)
  if (aChecker.assertCompliance(results.report) === 0) {
    return {
      pass: true,
    }
  } else {
    return {
      pass: false,
      message: () => aChecker.stringifyResults(results.report),
    }
  }
}

module.exports = toBeAccessible
