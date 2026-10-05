module.exports = {
  testEnvironment: 'jsdom',
  testEnvironmentOptions: { customExportConditions: ['node', 'node-addons'] },
  testMatch: ['<rootDir>/tests/unit/**/*.spec.js'],
  moduleFileExtensions: ['js', 'json', 'vue'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
  transform: { '^.+\\.vue$': '@vue/vue3-jest', '^.+\\.js$': 'babel-jest' },
  transformIgnorePatterns: ['node_modules/(?!(?:@vueuse|@floating-ui)/)'],
  clearMocks: true
}
