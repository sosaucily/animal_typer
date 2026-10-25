import { expect, test } from '@playwright/test';

test.beforeEach(async ({ request }) => {
  const response = await request.get('/__voice-studio');
  expect(response.ok()).toBe(true);
  const { clips } = await response.json();
  for (const id of Object.keys(clips)) {
    const removed = await request.delete(`/__voice-studio/${id}`, { headers: { Origin: 'http://localhost:5174' } });
    expect(removed.ok()).toBe(true);
  }
});

async function openStudio(page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Voice studio' }).click();
  await expect(page.getByRole('button', { name: 'Hold to record' })).toBeEnabled();
  await expect(page.getByRole('status')).not.toHaveText('Loading your recordings…');
}

async function record(page, method = 'keyboard', duration = 650) {
  if (method === 'keyboard') await page.keyboard.down('Space');
  else {
    const button = page.getByRole('button', { name: 'Hold to record' });
    const box = await button.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
  }
  await expect(page.getByRole('button', { name: 'Hold to record' })).toContainText('Recording');
  await page.waitForTimeout(duration);
  if (method === 'keyboard') await page.keyboard.up('Space');
  else await page.mouse.up();
  await expect(page.getByRole('status')).toContainText('Saved to the project!');
}

test('hold recording saves full sentences as project files, persists, and plays in the game', async ({ page, request }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await openStudio(page);
  await record(page);
  await expect(page.getByText('1 of 26 sentences saved')).toBeVisible();
  await page.getByRole('button', { name: 'Listen to take' }).click();
  await expect(page.getByRole('button', { name: 'Stop playback' })).toBeVisible();
  await page.getByRole('button', { name: 'Next sentence' }).click();
  await expect(page.getByText('“B is for Bear!”')).toBeVisible();
  await record(page, 'pointer');
  const project = await (await request.get('/audio/voice/manifest.json')).json();
  expect(Object.keys(project.clips)).toEqual(['phrase-A', 'phrase-B']);
  for (const clip of Object.values(project.clips)) {
    const asset = await request.get(`/audio/voice/${clip.file}`);
    expect(asset.ok()).toBe(true);
    expect((await asset.body()).length).toBeGreaterThan(100);
  }
  await page.reload();
  await page.getByRole('button', { name: 'Voice studio' }).click();
  await expect(page.getByText('2 of 26 sentences saved')).toBeVisible();
  await page.getByRole('button', { name: 'Close voice studio' }).click();
  await page.evaluate(() => {
    window.__playedVoiceClips = [];
    const original = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      if (this.src.includes('/audio/voice/')) window.__playedVoiceClips.push(this.src);
      return original.call(this);
    };
  });
  await page.keyboard.press('A');
  await expect(page.getByText('You found it!')).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.__playedVoiceClips.length)).toBe(1);
  expect(await page.evaluate(() => window.__playedVoiceClips[0])).toContain('/audio/voice/phrase-A-');
  await expect(page.getByRole('heading', { name: 'Bear', exact: true })).toBeVisible({ timeout: 8000 });
  expect(errors).toEqual([]);
});

test('one full sentence is recorded for each letter', async ({ page }) => {
  await openStudio(page);
  await expect(page.getByText('“A is for Aardvark!”')).toBeVisible();
  await record(page);
  await expect(page.getByText('1 of 26 sentences saved')).toBeVisible();
  await page.getByRole('button', { name: 'Record B' }).click();
  await expect(page.getByText('“B is for Bear!”')).toBeVisible();
  await page.getByRole('button', { name: 'Close voice studio' }).click();
  await page.evaluate(() => {
    window.__spokenFiles = [];
    const original = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      if (this.src.includes('/audio/voice/')) window.__spokenFiles.push(this.src);
      return original.call(this);
    };
  });
  await page.keyboard.press('A');
  await expect.poll(() => page.evaluate(() => window.__spokenFiles.length)).toBe(1);
  expect(await page.evaluate(() => window.__spokenFiles[0])).toContain('/audio/voice/phrase-A-');
  await expect(page.getByRole('heading', { name: 'Bear', exact: true })).toBeVisible({ timeout: 8000 });
});

test('voice backups round trip, reject invalid files, and deletion is per take', async ({ page }) => {
  await openStudio(page);
  await record(page);
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export backup' }).click();
  const download = await downloadEvent;
  const backup = await download.path();
  await page.getByRole('button', { name: 'Delete this take' }).click();
  await expect(page.getByText('0 of 26 sentences saved')).toBeVisible();
  await page.locator('input[type=file]').setInputFiles(backup);
  await expect(page.getByRole('status')).toContainText('Imported 1 recordings into the project');
  await expect(page.getByText('1 of 26 sentences saved')).toBeVisible();
  await page.locator('input[type=file]').setInputFiles({ name: 'invalid.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ format: 'alphabet-zoo-voice', version: 1, clips: [{ id: 'letter-A', audio: 'data:text/html;base64,eA==' }] })) });
  await expect(page.getByRole('status')).toContainText('invalid recording');
  await expect(page.getByText('1 of 26 sentences saved')).toBeVisible();
});

test('short takes preserve the old recording and releasing before mic permission does not record', async ({ page }) => {
  await openStudio(page);
  await record(page);
  await page.keyboard.down('Space');
  await expect(page.getByRole('button', { name: 'Hold to record' })).toContainText('Recording');
  await page.keyboard.up('Space');
  await expect(page.getByRole('status')).toContainText('little short');
  await expect(page.getByText('1 of 26 sentences saved')).toBeVisible();
  await page.evaluate(() => {
    const original = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = async (...args) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return original(...args);
    };
  });
  await page.keyboard.down('Space');
  await page.keyboard.up('Space');
  await expect(page.getByRole('button', { name: 'Hold to record' })).toContainText('new take');
  await expect(page.getByText('1 of 26 sentences saved')).toBeVisible();
});

test('all animal assets and license credits are present, with a responsive layout', async ({ page, request }) => {
  const response = await request.get('/animals/credits.json');
  const images = await response.json();
  expect(Object.keys(images)).toHaveLength(26);
  for (const [letter, image] of Object.entries(images)) {
    expect(image.artist, letter).toBeTruthy();
    expect(image.licenseUrl, letter).toContain('https://');
    const asset = await request.get(image.image);
    expect(asset.ok(), letter).toBeTruthy();
    expect(asset.headers()['content-type'], letter).toMatch(/^image\//);
  }
  await page.goto('/');
  await expect(page.getByRole('img', { name: 'Aardvark', exact: true })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'test-results/zoo-desktop.png' });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole('img', { name: 'Aardvark', exact: true })).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await page.getByRole('button', { name: 'Voice studio' }).click();
  await page.screenshot({ path: 'test-results/studio-mobile.png', fullPage: true });
  expect(await page.evaluate(() => document.querySelector('.voice-studio').getBoundingClientRect().right)).toBeLessThanOrEqual(390);
  await page.setViewportSize({ width: 1400, height: 1300 });
  await page.setContent(`<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:12px;font:14px system-ui">${Object.entries(images).map(([letter, image]) => `<div><img src="http://localhost:5174${image.image}" style="width:210px;height:170px;object-fit:cover"><p>${letter} · ${image.animal}</p></div>`).join('')}</div>`);
  await page.locator('img').evaluateAll((pictures) => Promise.all(pictures.map((picture) => picture.decode())));
  await page.screenshot({ path: 'test-results/animal-contact-sheet.png', fullPage: true });
});

test('microphone denial is recoverable and studio input does not advance the game', async ({ page }) => {
  await openStudio(page);
  await page.evaluate(() => { navigator.mediaDevices.getUserMedia = async () => { throw new DOMException('Denied', 'NotAllowedError'); }; });
  await page.keyboard.down('Space');
  await page.keyboard.up('Space');
  await expect(page.getByRole('status')).toContainText('Microphone access was blocked');
  await page.keyboard.press('A');
  await page.getByRole('button', { name: 'Close voice studio' }).click();
  await expect(page.getByRole('heading', { name: 'Aardvark', exact: true })).toBeVisible();
  await expect(page.getByText('Can you find this letter?')).toBeVisible();
});

test('long personal phrases finish before advancing and the voice preference is honored', async ({ page }) => {
  await openStudio(page);
  await record(page, 'keyboard', 4200);
  await page.getByRole('button', { name: 'Close voice studio' }).click();
  await page.keyboard.press('A');
  await expect(page.getByText('You found it!')).toBeVisible();
  await page.waitForTimeout(3700);
  await expect(page.getByRole('heading', { name: 'Aardvark', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Bear', exact: true })).toBeVisible({ timeout: 5000 });

  await page.reload();
  await page.getByRole('button', { name: 'Voice studio' }).click();
  await page.getByRole('checkbox', { name: 'Use my recordings in the game' }).uncheck();
  await page.getByRole('button', { name: 'Close voice studio' }).click();
  const fallback = page.waitForRequest('**/audio/phrase-A.mp3');
  await page.keyboard.press('A');
  await fallback;
});

test('leaving the window stops recording and releases microphone tracks', async ({ page }) => {
  await openStudio(page);
  await page.evaluate(() => {
    const original = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = async (...args) => {
      const stream = await original(...args);
      window.__recordingStream = stream;
      return stream;
    };
  });
  await page.keyboard.down('Space');
  await expect(page.getByRole('button', { name: 'Hold to record' })).toContainText('Recording');
  await expect(page.getByRole('button', { name: 'Next sentence' })).toBeDisabled();
  await page.waitForTimeout(400);
  await page.evaluate(() => window.dispatchEvent(new Event('blur')));
  await expect(page.getByRole('status')).toContainText('Saved to the project!');
  expect(await page.evaluate(() => window.__recordingStream.getTracks().every((track) => track.readyState === 'ended'))).toBe(true);
  await page.keyboard.up('Space');
});

test('earlier browser takes can be copied into project files without replacing newer takes', async ({ page, request }) => {
  await openStudio(page);
  await record(page);
  const project = await (await request.get('/__voice-studio')).json();
  const file = project.clips['phrase-A'].file;
  const oldClip = await page.evaluate(async (url) => {
    const blob = await (await fetch(url)).blob();
    await new Promise((resolve, reject) => {
      const open = indexedDB.open('alphabet-zoo-voices', 1);
      open.onupgradeneeded = () => open.result.createObjectStore('recordings', { keyPath: 'id' });
      open.onerror = () => reject(open.error);
      open.onsuccess = () => {
        const transaction = open.result.transaction('recordings', 'readwrite');
        transaction.objectStore('recordings').put({ id: 'letter-A', blob, updatedAt: Date.now() });
        transaction.objectStore('recordings').put({ id: 'letter-B', blob, updatedAt: Date.now() });
        transaction.oncomplete = resolve;
        transaction.onerror = () => reject(transaction.error);
      };
    });
    return blob.size;
  }, `/audio/voice/${file}`);
  expect(oldClip).toBeGreaterThan(100);
  await page.getByRole('button', { name: 'Close voice studio' }).click();
  await page.getByRole('button', { name: 'Voice studio' }).click();
  await expect(page.getByRole('button', { name: 'Copy 1 earlier browser recording into project' })).toBeVisible();
  await page.getByRole('button', { name: 'Copy 1 earlier browser recording into project' }).click();
  await expect(page.getByRole('status')).toContainText('1 earlier browser recording copied into the project');
  const updated = await (await request.get('/__voice-studio')).json();
  expect(updated.clips['phrase-A'].file).toBe(file);
  expect(updated.clips['phrase-B'].file).toMatch(/^phrase-B-/);
});
