import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  preset: "ts-jest",
  testEnvironment: "node",
  // Ensure ts-jest compiles TS to CommonJS for Jest, regardless of project ESNext module output
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: {
          module: "commonjs",
          target: "ES2020",
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          sourceMap: true,
        },
      },
    ],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "json"],
  testMatch: ["**/?(*.)+(spec|test).ts"],
};

export default config;
