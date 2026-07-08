#!/usr/bin/env node

import { spawn, spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import process from 'node:process';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const isWindows = process.platform === 'win32';
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';
const rawPlaywrightArgs = process.argv.slice(2);
const playwrightArgs = rawPlaywrightArgs[0] === '--' ? rawPlaywrightArgs.slice(1) : rawPlaywrightArgs;
const serverTimeoutMs = Number(process.env.PLAYWRIGHT_SERVER_TIMEOUT_MS ?? 120_000);
const nextCliPath = resolve(rootDir, 'node_modules', 'next', 'dist', 'bin', 'next');
const playwrightCliPath = resolve(rootDir, 'node_modules', '@playwright', 'test', 'cli.js');

function childEnv() {
  const env = {
    ...process.env,
    PLAYWRIGHT_BASE_URL: baseURL,
    PLAYWRIGHT_MANAGE_WEB_SERVER: '0',
  };

  if (env.FORCE_COLOR) {
    delete env.NO_COLOR;
  }

  return env;
}

async function isServerReady() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1_000);

  try {
    const response = await fetch(baseURL, { signal: controller.signal });
    return response.status >= 200 && response.status < 500;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

function spawnDevServer() {
  const child = spawn(process.execPath, [nextCliPath, 'dev'], {
    cwd: rootDir,
    detached: !isWindows,
    env: childEnv(),
    shell: false,
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  });

  if (process.env.E2E_DEBUG_SERVER) {
    child.stdout.on('data', (chunk) => process.stdout.write(`[dev] ${chunk}`));
    child.stderr.on('data', (chunk) => process.stderr.write(`[dev] ${chunk}`));
  }

  return child;
}

async function waitForServer(child) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < serverTimeoutMs) {
    if (child.exitCode !== null) {
      throw new Error(`Dev server exited early with code ${child.exitCode}.`);
    }

    if (await isServerReady()) {
      return;
    }

    await delay(500);
  }

  throw new Error(`Timed out waiting for ${baseURL}.`);
}

function stopDevServer(child) {
  if (!child.pid || child.exitCode !== null) {
    return;
  }

  if (isWindows) {
    spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], {
      stdio: 'ignore',
      windowsHide: true,
    });
  } else {
    try {
      process.kill(-child.pid, 'SIGTERM');
    } catch {
      child.kill('SIGTERM');
    }
  }

  child.stdout.destroy();
  child.stderr.destroy();
  child.unref();
}

function runPlaywright() {
  return new Promise((resolveExitCode) => {
    let settled = false;
    const child = spawn(process.execPath, [playwrightCliPath, 'test', ...playwrightArgs], {
      cwd: rootDir,
      env: childEnv(),
      shell: false,
      stdio: 'inherit',
      windowsHide: true,
    });

    const finish = (code) => {
      if (settled) {
        return;
      }

      settled = true;
      resolveExitCode(code ?? 1);
    };

    child.on('error', (error) => {
      console.error(`[e2e] Failed to run Playwright: ${error.message}`);
      finish(1);
    });

    child.on('exit', finish);
    child.on('close', finish);
  });
}

let devServer;

try {
  if (await isServerReady()) {
    console.log(`[e2e] Reusing existing server at ${baseURL}`);
  } else {
    console.log(`[e2e] Starting dev server at ${baseURL}`);
    devServer = spawnDevServer();
    await waitForServer(devServer);
  }

  process.exitCode = await runPlaywright();
} catch (error) {
  console.error(`[e2e] ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
} finally {
  if (devServer) {
    stopDevServer(devServer);
  }
}
