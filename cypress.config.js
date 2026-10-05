const { defineConfig } = require('cypress')
module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8097',
    specPattern: 'tests/e2e/**/*.cy.js',
    supportFile: false
  },
  viewportWidth: 1280,
  viewportHeight: 900,
  video: false,
  screenshotOnRunFailure: true
})
