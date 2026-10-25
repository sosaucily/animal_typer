import { decodeVoicePack, MAX_CLIP_BYTES, MAX_PACK_BYTES, VALID_VOICE_ID } from './voicePack';

const DATABASE = 'alphabet-zoo-voices';
const STORE = 'recordings';
const SETTING = 'alphabet-zoo-use-my-voice';
let databasePromise;

// The old browser database is read only, so existing takes can be copied into
// project files without discarding the user's only copy.
function legacyDatabase() {
  if (!databasePromise) {
    databasePromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DATABASE, 1);
      request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: 'id' });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => { databasePromise = null; reject(request.error); };
    });
  }
  return databasePromise;
}

export async function getLegacyRecordings() {
  const database = await legacyDatabase();
  return new Promise((resolve, reject) => {
    const request = database.transaction(STORE, 'readonly').objectStore(STORE).getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// The old recorder offered two prompts. For this family's original takes, the
// clips saved under letter-* contain the whole animal sentence. Prefer a take
// already saved as phrase-* if both are present.
export function normalizeLegacyRecordings(recordings) {
  const normalized = new Map();
  for (const recording of recordings) {
    const id = recording.id.replace(/^letter-/, 'phrase-');
    if (!normalized.has(id) || recording.id.startsWith('phrase-')) {
      normalized.set(id, { ...recording, id });
    }
  }
  return [...normalized.values()];
}

function fileUrl(file) {
  if (!/^(letter|phrase)-[A-Z]-[a-f0-9]{24}\.(webm|ogg|m4a|wav|mp3)$/.test(file)) throw new Error('Invalid project recording filename.');
  return `/audio/voice/${file}`;
}

async function responseJson(response) {
  const type = response.headers.get('content-type') || '';
  if (!type.includes('application/json')) throw new Error('Project recording storage is unavailable. Run the app locally to edit voices.');
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Could not save this project recording.');
  return data;
}

export async function getVoiceLibrary() {
  const url = import.meta.env.DEV ? '/__voice-studio' : '/audio/voice/manifest.json';
  const response = await fetch(url, { cache: 'no-store' });
  const manifest = await responseJson(response);
  if (manifest.version !== 1 || !manifest.clips || Array.isArray(manifest.clips)) throw new Error('Invalid project voice manifest.');
  return {
    canEdit: import.meta.env.DEV && manifest.canEdit === true,
    recordings: Object.values(manifest.clips).map(({ id, file, mimeType, updatedAt }) => ({ id, url: fileUrl(file), mimeType, updatedAt })),
  };
}

export async function getRecording(id) {
  const library = await getVoiceLibrary();
  return library.recordings.find((recording) => recording.id === id);
}

function editorRequest(path, options) {
  if (!import.meta.env.DEV) throw new Error('Open the local project to edit voice files.');
  return fetch(`/__voice-studio${path}`, options).then(responseJson);
}

export async function saveRecording(id, blob) {
  if (!VALID_VOICE_ID.test(id) || !(blob instanceof Blob) || !blob.size || blob.size > MAX_CLIP_BYTES) throw new Error('Invalid recording.');
  await editorRequest(`/${id}`, { method: 'PUT', body: blob, headers: { 'Content-Type': blob.type } });
}

export async function deleteRecording(id) {
  if (!VALID_VOICE_ID.test(id)) throw new Error('Invalid recording prompt.');
  await editorRequest(`/${id}`, { method: 'DELETE' });
}

export function usesPersonalVoice() {
  try { return localStorage.getItem(SETTING) !== 'false'; } catch { return true; }
}

export function setUsesPersonalVoice(enabled) {
  localStorage.setItem(SETTING, String(enabled));
}

const toDataURL = (blob) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = () => reject(reader.error);
  reader.readAsDataURL(blob);
});

export async function exportVoicePack() {
  const { recordings } = await getVoiceLibrary();
  const clips = await Promise.all(recordings.map(async ({ id, url }) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Could not read ${id} from the project.`);
    return { id, audio: await toDataURL(await response.blob()) };
  }));
  return new Blob([JSON.stringify({ format: 'alphabet-zoo-voice', version: 1, clips })], { type: 'application/json' });
}

export async function importVoicePack(file, { onlyMissing = false } = {}) {
  if (file.size > MAX_PACK_BYTES) throw new Error('Please choose a voice backup smaller than 50 MB.');
  const text = await file.text();
  decodeVoicePack(JSON.parse(text));
  const result = await editorRequest('/import', {
    method: 'POST', body: text,
    headers: { 'Content-Type': 'application/json', ...(onlyMissing ? { 'X-Only-Missing': 'true' } : {}) },
  });
  return result.saved;
}

export async function copyLegacyRecordings() {
  const { recordings } = await getVoiceLibrary();
  const existing = new Set(recordings.map(({ id }) => id));
  const pending = normalizeLegacyRecordings(await getLegacyRecordings()).filter(({ id }) => !existing.has(id));
  if (!pending.length) return 0;
  const clips = await Promise.all(pending.map(async ({ id, blob }) => ({ id, audio: await toDataURL(blob) })));
  return importVoicePack(new Blob([JSON.stringify({ format: 'alphabet-zoo-voice', version: 1, clips })], { type: 'application/json' }), { onlyMissing: true });
}

export async function exportLegacyVoicePack() {
  const legacy = normalizeLegacyRecordings(await getLegacyRecordings());
  const clips = await Promise.all(legacy.map(async ({ id, blob }) => ({ id, audio: await toDataURL(blob) })));
  return new Blob([JSON.stringify({ format: 'alphabet-zoo-voice', version: 1, clips })], { type: 'application/json' });
}
