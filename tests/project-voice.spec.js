import { expect, test } from '@playwright/test';
import { mkdtemp, readFile, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createProjectVoiceStore } from '../scripts/voiceStudioServer.mjs';

test('project voice store writes, replaces, and removes real audio files', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'zoo-store-'));
  const store = createProjectVoiceStore(directory);
  const first = Uint8Array.from([0x1a, 0x45, 0xdf, 0xa3, 1, 2, 3, 4]);
  const second = Uint8Array.from([0x1a, 0x45, 0xdf, 0xa3, 5, 6, 7, 8]);
  const initial = await store.save([{ id: 'phrase-Z', bytes: first, mimeType: 'audio/webm' }]);
  const firstFile = initial.clips['phrase-Z'].file;
  expect(new Uint8Array(await readFile(join(directory, firstFile)))).toEqual(first);
  const replacement = await store.save([{ id: 'phrase-Z', bytes: second, mimeType: 'audio/webm' }]);
  expect(replacement.clips['phrase-Z'].file).not.toBe(firstFile);
  expect(await readdir(directory)).not.toContain(firstFile);
  expect(JSON.parse(await readFile(join(directory, 'manifest.json'), 'utf8')).clips['phrase-Z'].file).toBe(replacement.clips['phrase-Z'].file);
  await store.delete('phrase-Z');
  expect((await store.manifest()).clips['phrase-Z']).toBeUndefined();
  expect(await readdir(directory)).toEqual(['manifest.json']);
});
