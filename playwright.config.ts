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
      name: 'chromium-320',
      use: {
        browserName: 'chromium',
        viewport: { width: 320, height: 740 },
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: 'chromium-375',
      use: {
        browserName: 'chromium',
        viewport: { width: 375, height: 812 },
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: 'chromium-768',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 768, height: 1024 },
      },
    },
    {
      name: 'chromium-1024',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1024, height: 768 },
      },
    },
    {
      name: 'chromium-1365',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1365, height: 768 },
      },
    },
    {
      name: 'chromium-1536',
      use: {
        ...devices['Desktop Chrome'],
        browserName: 'chromium',
        viewport: { width: 1536, height: 864 },
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
