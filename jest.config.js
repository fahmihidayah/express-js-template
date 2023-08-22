/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // setupFilesAfterEnv: ['./mocks.ts'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  setupFilesAfterEnv: ['<rootDir>/prisma/singleton.ts'],
  testEnvironment: "@quramy/jest-prisma/environment",
  testEnvironmentOptions: {
    verboseQuery: false,
  },
};