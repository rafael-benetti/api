const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions } = require("./tsconfig.json");

module.exports = {
  clearMocks: true,
  collectCoverage: false,
  collectCoverageFrom: [
    "<rootDir>/src/modules/**/services/**/*.service.ts",
    "<rootDir>/src/shared/services/**/*.service.ts",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["json", "text", "lcov", "clover"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/src/",
  }),
  preset: "ts-jest",
  setupFiles: ["dotenv/config"],
  testEnvironment: "node",
  testMatch: ["**/*.spec.ts"],
};
