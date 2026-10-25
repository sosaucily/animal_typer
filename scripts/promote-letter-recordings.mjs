// One-time migration for the original 26 takes, which contain complete
// "A is for Aardvark" lines but were saved under letter-* prompt IDs.
import { createHash } from 'node:crypto';
import { copyFile, mkdir, readFile, rename, readdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const directory = path.join(root, 'public/audio/voice');
const manifestPath = path.join(directory, 'manifest.json');
const manifestBytes = await readFile(manifestPath);
const manifest = JSON.parse(manifestBytes.toString('utf8'));
const letters = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
if (letters.every((letter) => manifest.clips[`phrase-${letter}`]) && letters.every((letter) => !manifest.clips[`letter-${letter}`])) {
  console.log('All 26 takes are already saved as phrases.');
  process.exit(0);
}
const keys = Object.keys(manifest.clips);
if (keys.length !== 26 || !letters.every((letter) => manifest.clips[`letter-${letter}`])) {
  throw new Error('Expected exactly 26 letter takes and no phrase takes; no files were changed.');
}

const sources = await Promise.all(letters.map(async (letter) => {
  const original = manifest.clips[`letter-${letter}`];
  const bytes = await readFile(path.join(directory, original.file));
  const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 24);
  if (!original.file.endsWith(`-${hash}.webm`) || bytes.subarray(0, 4).toString('hex') !== '1a45dfa3') {
    throw new Error(`Recording ${letter} failed validation; no files were changed.`);
  }
  return { letter, original, bytes, target: `phrase-${letter}-${hash}.webm` };
}));

const backupDirectory = path.join(root, 'voice-backups', 'before-phrase-migration');
await mkdir(backupDirectory, { recursive: true });
await writeFile(path.join(backupDirectory, 'manifest.json'), manifestBytes, { flag: 'wx' });
for (const { original } of sources) {
  await copyFile(path.join(directory, original.file), path.join(backupDirectory, original.file));
}
const backupCount = (await readdir(backupDirectory)).length;
if (backupCount !== 27) throw new Error('The backup is incomplete; the original recordings were not changed.');

for (const { letter, original, target } of sources) {
  await copyFile(path.join(directory, original.file), path.join(directory, target));
}
const nextManifest = {
  version: 1,
  clips: Object.fromEntries(sources.map(({ letter, original, target }) => [
    `phrase-${letter}`,
    { id: `phrase-${letter}`, file: target, mimeType: original.mimeType, updatedAt: original.updatedAt },
  ])),
};
const temporary = path.join(directory, `.manifest-migration-${process.pid}.tmp`);
await writeFile(temporary, `${JSON.stringify(nextManifest, null, 2)}\n`);
await rename(temporary, manifestPath);
for (const { original } of sources) await unlink(path.join(directory, original.file));
console.log(`Promoted all 26 takes to complete animal phrases. Backup: ${backupDirectory}`);
