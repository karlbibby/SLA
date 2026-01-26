module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/js/__tests__'],
  testMatch: ['**/__tests__/**/*.test.js', '**/__tests__/**/*.spec.js'],
  collectCoverage: false,
  collectCoverageFrom: [
    'js/character.js',
    'js/validators.js',
    'js/app.js',
    'js/ui/wizard.js',
    'js/ui/components.js'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/js/__tests__/',
    'pdfExport',
    '/js/ui/steps/',
    '/js/data/'
  ],
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  moduleFileExtensions: ['js'],
  testTimeout: 10000
};
