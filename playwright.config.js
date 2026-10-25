import { defineConfig } from '@playwright/test';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const testVoiceDirectory = mkdtempSync(join(tmpdir(), 'alphabet-zoo-test-voices-'));
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:5174',
    browserName: 'chromium',
    permissions: ['microphone'],
    launchOptions: {
      ...(process.env.PLAYWRIGHT_CHROME_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROME_PATH } : {}),
      args: ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream', '--autoplay-policy=no-user-gesture-required'],
    },
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 5174 --strictPort',
    url: 'http://localhost:5174',
    env: { ALPHABET_ZOO_VOICE_DIR: testVoiceDirectory },
    reuseExistingServer: false,
  },
});
