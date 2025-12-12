import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./tests-e2e",
  timeout: 30_000,
  use: {
    baseURL: "http://localhost:4173/z-contas.app/",
    trace: "on-first-retry"
  },
  webServer: {
    command: "npm run preview",
    url: "http://localhost:4173/z-contas.app/",
    reuseExistingServer: true,
    timeout: 60_000
  },
  projects: [
    {
      name: "Chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
})
