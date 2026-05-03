import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

const config = {
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^server-only$': '<rootDir>/test/mocks/server-only.js',
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
};

export default createJestConfig(config);
