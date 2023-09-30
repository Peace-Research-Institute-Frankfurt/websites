module.exports = {
  ruleArchive: 'latest',
  policies: ['WCAG_2_1'],
  failLevels: ['violation'],
  reportLevels: ['violation', 'potentialviolation', 'recommendation', 'potentialrecommendation', 'manual'],
  outputFormat: ['json'],
  outputFolder: 'results',
  baselineFolder: 'baselines',
}
