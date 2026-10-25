import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { decodeVoicePack, MAX_CLIP_BYTES, MAX_PACK_BYTES, VALID_VOICE_ID } from '../src/utils/voicePack.js';

const AUDIO_TYPES = { 'audio/webm': 'webm', 'audio/ogg': 'ogg', 'audio/mp4': 'm4a', 'audio/wav': 'wav', 'audio/mpeg': 'mp3' };
const EMPTY = { version: 1, clips: {} };
const VOICE_FILE = /^(?:letter|phrase)-[A-Z]-[a-f0-9]{24}\.(?:webm|ogg|m4a|wav|mp3)$/;

function audioExtension(mimeType, bytes) {
  const type = mimeType.split(';')[0];
  const extension = AUDIO_TYPES[type];
  const data = Buffer.from(bytes);
  const isAudio = type === 'audio/webm' ? data.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]))
    : type === 'audio/ogg' ? data.toString('ascii', 0, 4) === 'OggS'
      : type === 'audio/mp4' ? data.toString('ascii', 4, 8) === 'ftyp'
        : type === 'audio/wav' ? data.toString('ascii', 0, 4) === 'RIFF' && data.toString('ascii', 8, 12) === 'WAVE'
          : type === 'audio/mpeg' && (data.toString('ascii', 0, 3) === 'ID3' || (data[0] === 0xff && (data[1] & 0xe0) === 0xe0));
  if (!extension || !isAudio || !bytes.length || bytes.length > MAX_CLIP_BYTES) throw new Error('The recording is not a supported audio file.');
  return extension;
}

export function createProjectVoiceStore(directory) {
  let queue = Promise.resolve();
  const manifestPath = path.join(directory, 'manifest.json');
  async function manifest() {
    try {
      const result = JSON.parse(await readFile(manifestPath, 'utf8'));
      if (result.version !== 1 || !result.clips || Array.isArray(result.clips)) throw new Error('Invalid project voice manifest.');
      return result;
    } catch (error) {
      if (error.code === 'ENOENT') return structuredClone(EMPTY);
      throw error;
    }
  }
  async function writeManifest(value) {
    const temporary = path.join(directory, `.manifest-${randomUUID()}.tmp`);
    try {
      await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
      await rename(temporary, manifestPath);
    } finally { await unlink(temporary).catch(() => {}); }
  }
  function mutate(operation) {
    const result = queue.then(operation);
    queue = result.catch(() => {});
    return result;
  }
  return {
    manifest,
    async readAudio(filename) {
      if (!VOICE_FILE.test(filename)) throw new Error('Invalid audio filename.');
      return readFile(path.join(directory, filename));
    },
    save(clips, { onlyMissing = false } = {}) {
      // Check all clips before writing any files or changing the manifest.
      const validated = clips.map((clip) => {
        if (!VALID_VOICE_ID.test(clip.id)) throw new Error('Invalid recording prompt.');
        return { ...clip, extension: audioExtension(clip.mimeType, clip.bytes) };
      });
      return mutate(async () => {
        await mkdir(directory, { recursive: true });
        const value = await manifest();
        const previousFiles = [];
        let saved = 0;
        for (const clip of validated) {
          if (onlyMissing && value.clips[clip.id]) continue;
          const hash = createHash('sha256').update(clip.bytes).digest('hex').slice(0, 24);
          const file = `${clip.id}-${hash}.${clip.extension}`;
          await writeFile(path.join(directory, file), clip.bytes);
          if (value.clips[clip.id]?.file !== file) previousFiles.push(value.clips[clip.id]?.file);
          value.clips[clip.id] = { id: clip.id, file, mimeType: clip.mimeType, updatedAt: Date.now() };
          saved += 1;
        }
        await writeManifest(value);
        for (const file of previousFiles) {
          if (file && VOICE_FILE.test(file)) await unlink(path.join(directory, file)).catch(() => {});
        }
        return { saved, ...value };
      });
    },
    delete(id) {
      return mutate(async () => {
        const value = await manifest();
        const previous = value.clips[id];
        delete value.clips[id];
        await mkdir(directory, { recursive: true });
        await writeManifest(value);
        if (previous && VOICE_FILE.test(previous.file)) await unlink(path.join(directory, previous.file)).catch(() => {});
        return value;
      });
    },
  };
}

async function readBody(request, maximum) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maximum) throw new Error('The recording or backup is too large.');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

function isLocal(request) {
  const remote = request.socket.remoteAddress;
  const host = request.headers.host || '';
  return ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(remote)
    && /^(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/.test(host);
}

export function voiceStudioServer({ directory } = {}) {
  return {
    name: 'alphabet-zoo-project-voice',
    configureServer(server) {
      const store = createProjectVoiceStore(directory || path.join(server.config.root, 'public/audio/voice'));
      server.middlewares.use(async (request, response, next) => {
        const pathname = (request.url || '').split('?')[0];
        const isEditor = pathname === '/__voice-studio' || pathname.startsWith('/__voice-studio/');
        const isAudio = pathname.startsWith('/audio/voice/');
        if (!isEditor && !isAudio) return next();
        const json = (status, data) => {
          response.statusCode = status;
          response.setHeader('Content-Type', 'application/json');
          response.setHeader('Cache-Control', 'no-store');
          response.end(JSON.stringify(data));
        };
        if (!isLocal(request)) return json(403, { error: 'Project recording is only available on this computer.' });
        if (!['GET', 'HEAD'].includes(request.method) && request.headers.origin !== `http://${request.headers.host}`) {
          return json(403, { error: 'Open Voice studio in the local app to save recordings.' });
        }
        try {
          if (request.method === 'GET' && pathname === '/__voice-studio') return json(200, { canEdit: true, ...await store.manifest() });
          if (request.method === 'GET' && pathname === '/audio/voice/manifest.json') return json(200, await store.manifest());
          if (request.method === 'GET' && isAudio) {
            const file = pathname.slice('/audio/voice/'.length);
            const bytes = await store.readAudio(file);
            response.setHeader('Content-Type', Object.entries(AUDIO_TYPES).find(([, extension]) => extension === file.split('.').pop())?.[0] || 'application/octet-stream');
            response.setHeader('Cache-Control', 'no-cache');
            response.end(bytes);
            return;
          }
          if (request.method === 'POST' && pathname === '/__voice-studio/import') {
            const pack = JSON.parse((await readBody(request, MAX_PACK_BYTES)).toString('utf8'));
            const clips = decodeVoicePack(pack);
            return json(200, await store.save(clips, { onlyMissing: request.headers['x-only-missing'] === 'true' }));
          }
          const id = pathname.slice('/__voice-studio/'.length);
          if (!VALID_VOICE_ID.test(id)) return json(400, { error: 'Invalid recording prompt.' });
          if (request.method === 'PUT') {
            const bytes = await readBody(request, MAX_CLIP_BYTES);
            return json(200, await store.save([{ id, bytes, mimeType: request.headers['content-type'] || '' }]));
          }
          if (request.method === 'DELETE') return json(200, await store.delete(id));
          return json(405, { error: 'Unsupported recording action.' });
        } catch (error) {
          if (error.code === 'ENOENT') return json(404, { error: 'Recording not found.' });
          return json(400, { error: error.code ? 'Could not save to the project folder. Check its permissions and try again.' : error.message });
        }
      });
    },
  };
}
