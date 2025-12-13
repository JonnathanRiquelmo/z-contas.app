import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/tests-e2e/**",
      "**/.{idea,git,cache,output,temp}/**",
    ],
  },
})

