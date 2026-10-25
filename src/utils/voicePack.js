export const VALID_VOICE_ID = /^(letter|phrase)-[A-Z]$/;
export const MAX_CLIP_BYTES = 5 * 1024 * 1024;
export const MAX_PACK_BYTES = 50 * 1024 * 1024;
export const AUDIO_DATA_URL = /^data:(audio\/(?:webm|ogg|mp4|wav|mpeg)(?:;codecs=[\w,.-]+)?);base64,([A-Za-z0-9+/=]+)$/;

export function decodeVoicePack(pack) {
  if (pack?.format !== 'alphabet-zoo-voice' || pack.version !== 1 || !Array.isArray(pack.clips) || pack.clips.length > 52) {
    throw new Error('This is not an Alphabet Zoo voice backup.');
  }
  const ids = new Set();
  return pack.clips.map((clip) => {
    const match = typeof clip?.audio === 'string' && AUDIO_DATA_URL.exec(clip.audio);
    if (typeof clip?.id !== 'string' || !VALID_VOICE_ID.test(clip.id) || ids.has(clip.id) || !match) {
      throw new Error('The backup contains an invalid recording.');
    }
    ids.add(clip.id);
    const bytes = Uint8Array.from(atob(match[2]), (character) => character.charCodeAt(0));
    if (!bytes.length || bytes.length > MAX_CLIP_BYTES) throw new Error('A recording in this backup is empty or too large.');
    return { id: clip.id, bytes, mimeType: match[1] };
  });
}
