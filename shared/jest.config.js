const config = {
  transform: {
    '^.+\\.jsx?$': `<rootDir>/jest/jest-preprocess.js`,
  },
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss)$': `identity-obj-proxy`,
    '.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': `<rootDir>/__mocks__/file-mock.js`,
    uuid: require.resolve('uuid'),
    axios: require.resolve('axios'),
  },
  testPathIgnorePatterns: [`node_modules`, `\\.cache`, `<rootDir>.*/public`],
  transformIgnorePatterns: [`node_modules/(?!(gatsby|gatsby-script|gatsby-link)/)`, `ace-node\\.js`],
  globals: {
    __PATH_PREFIX__: ``,
  },
  testEnvironmentOptions: {
    url: `http://localhost`,
  },
  setupFiles: [`./jest/loadershim.js`],
  testEnvironment: `jsdom`,
  setupFilesAfterEnv: ['<rootDir>/jest/setupAfterEnv.js'],
}

module.exports = config
