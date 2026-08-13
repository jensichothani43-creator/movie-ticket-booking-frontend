
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./src/tests",

  // Only Playwright E2E tests
  testMatch: "**/*.spec.js",

  // Ignore Vitest tests
  testIgnore: "**/*.test.js",

  use: {
    baseURL: "http://localhost:5173",
    headless: false,
  },

  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: true,
  },
});