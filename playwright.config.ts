import { defineConfig, devices } from '@playwright/test';

const isWindows = process.platform === 'win32';
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';
const shouldManageWebServer = process.env.PLAYWRIGHT_MANAGE_WEB_SERVER !== '0';

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.e2e.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list']],
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1365, height: 768 },
      },
    },
    {
      name: 'chromium-tablet',
      use: {
        ...devices['iPad (gen 7)'],
        browserName: 'chromium',
      },
    },
    {
      name: 'chromium-mobile',
      use: {
        ...devices['Pixel 5'],
        browserName: 'chromium',
      },
    },
  ],
  ...(shouldManageWebServer
    ? {
        webServer: {
          command: isWindows ? 'pnpm.cmd run dev' : 'pnpm run dev',
          url: baseURL,
          reuseExistingServer: true,
          stdout: 'ignore' as const,
          stderr: 'ignore' as const,
          timeout: 120_000,
        },
      }
    : {}),
});
