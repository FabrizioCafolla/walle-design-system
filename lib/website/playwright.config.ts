import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/@walle/playwright",
  use: {
    baseURL: "http://localhost:4322/walle-design-system",
  },
  webServer: {
    command: "yarn dev",
    url: "http://localhost:4322",
    reuseExistingServer: true,
    timeout: 30000,
  },
});
