// jest.config.js
module.exports = {
  // Usa el entorno de Node.js
  testEnvironment: 'node',

  // Integra Jest con TypeScript
  preset: 'ts-jest',

  // Detecta tanto unit tests como E2E tests
  testMatch: [
    '**/*.spec.ts',      // unit tests
    '**/*.e2e-spec.ts',  // e2e tests
  ],

  // Ignora dist y node_modules
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],

  // Limpia mocks entre tests
  clearMocks: true,

  // Soporte para imports relativos de src/
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },

  // Aumenta el timeout para E2E
  testTimeout: 15000,

  coveragePathIgnorePatterns: [
  '<rootDir>/src/main.ts',
  '<rootDir>/src/notebooks/dto/', // ignora los DTOs
],
};
