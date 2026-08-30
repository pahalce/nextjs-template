import { defineConfig } from "@playwright/test";

import { sharedConfig } from "./playwright.shared";

export default defineConfig(sharedConfig, {
  forbidOnly: false,
  retries: 0,
  reporter: "list",
});
