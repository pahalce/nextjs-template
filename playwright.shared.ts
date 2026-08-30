import { devices, type PlaywrightTestConfig } from "@playwright/test";

const port = 3100;

export const sharedConfig = {
  testDir: "./e2e",
  fullyParallel: true,
  globalSetup: "./e2e/global-setup.ts",
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
} satisfies PlaywrightTestConfig;
