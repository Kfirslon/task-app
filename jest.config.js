// Load environment variables BEFORE jest even starts
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "tests", ".env.test") });

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
