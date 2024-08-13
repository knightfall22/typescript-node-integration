module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  testMatch: ['**/**/*.test.ts'],
  forceExit: true,
  clearMocks: true,
  testTimeout: 2000000,
};
