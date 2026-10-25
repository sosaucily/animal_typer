import { getRecording, usesPersonalVoice } from './voiceStore';

/**
 * AudioManager
 *
 * Audio priority:
 *   1. Your recordings, saved as project audio files by Voice Studio
 *   2. Pre-recorded .mp3 files in /public/audio/
 *   3. SpeechSynthesis fallback if the file is missing
 *
 * Expected file naming convention:
 *   /public/audio/letter-A.mp3      → speaks the letter "A"
 *   /public/audio/phrase-A.mp3      → speaks "A is for Aardvark!"
 *   /public/audio/success.mp3       → success chime  (optional)
 *   /public/audio/boop.mp3          → wrong-key boop (optional)
 *   /public/audio/fanfare.mp3       → grand finale   (optional)
 */

let audioCtx = null;
let voiceRequest = 0;
let cancelVoice = null;
const effectStops = new Set();

function getAudioContext() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

export function stopAudio() {
  voiceRequest += 1;
  cancelVoice?.();
  cancelVoice = null;
  window.speechSynthesis?.cancel();
  effectStops.forEach((stop) => stop());
}

// Resolve after playback, so the game can give every spoken phrase time to finish.
function playFile(path, { voice = false } = {}) {
  return new Promise((resolve) => {
    const audio = new Audio(path);
    let finished = false;
    const finish = (played) => {
      if (finished) return;
      finished = true;
      clearTimeout(timeout);
      audio.pause();
      audio.removeAttribute('src');
      if (voice && cancelVoice === cancel) cancelVoice = null;
      effectStops.delete(cancel);
      resolve(played);
    };
    const cancel = () => finish(true);
    if (voice) cancelVoice = cancel;
    else effectStops.add(cancel);
    const timeout = setTimeout(() => finish(false), 18000);
    audio.onended = () => finish(true);
    audio.onerror = () => finish(false);
    audio.play().catch(() => finish(false));
  });
}

function speakWithSynthesis(text) {
  if (!window.speechSynthesis) return Promise.resolve();
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 1.2;
    const voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.find((voice) => voice.lang.startsWith('en') && voice.name.includes('Samantha'))
      || voices.find((voice) => voice.lang.startsWith('en-US'))
      || voices.find((voice) => voice.lang.startsWith('en')) || null;
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      clearTimeout(timeout);
      if (cancelVoice === finish) cancelVoice = null;
      resolve();
    };
    const timeout = setTimeout(() => { window.speechSynthesis.cancel(); finish(); }, 18000);
    cancelVoice = finish;
    utterance.onend = finish;
    utterance.onerror = finish;
    window.speechSynthesis.speak(utterance);
  });
}

async function speak(id, fallback, alternateRecordingId) {
  voiceRequest += 1;
  const request = voiceRequest;
  cancelVoice?.();
  window.speechSynthesis?.cancel();
  if (usesPersonalVoice()) {
    try {
      const recording = await getRecording(id);
      if (request !== voiceRequest) return;
      if (recording && await playFile(recording.url, { voice: true })) return;
      if (request !== voiceRequest) return;
      if (alternateRecordingId) {
        const alternate = await getRecording(alternateRecordingId);
        if (request !== voiceRequest) return;
        if (alternate && await playFile(alternate.url, { voice: true })) return;
      }
    } catch { /* Keep the original voice available if a project file cannot be read. */ }
  }
  if (request !== voiceRequest) return;
  const played = await playFile(`/audio/${id}.mp3`, { voice: true });
  if (!played && request === voiceRequest) await speakWithSynthesis(fallback);
}

export function speakLetter(letter) {
  return speak(`letter-${letter.toUpperCase()}`, letter.toUpperCase());
}

export function speakSuccess(letter, animal) {
  const upper = letter.toUpperCase();
  return speak(`phrase-${upper}`, `${upper} is for ${animal}!`, `letter-${upper}`);
}

export async function playSuccessChime() {
  if (!await playFile('/audio/success.mp3')) synthesizeSuccessChime();
}

export async function playBoop() {
  if (!await playFile('/audio/boop.mp3')) synthesizeBoop();
}

export async function playFanfare() {
  if (!await playFile('/audio/fanfare.mp3')) synthesizeFanfare();
}

// ── Synthesized sound fallbacks ─────────────────────────────────────

function synthesizeSuccessChime() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    const durations = [0.15, 0.15, 0.3];

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      const startTime = now + i * 0.12;
      const duration = durations[i];
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    });
  } catch { /* Audio not available */ }
}

function synthesizeBoop() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.15);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  } catch { /* Audio not available */ }
}

function synthesizeFanfare() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99, 1046.5];

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = i < 4 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);
      const startTime = now + i * 0.1;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.25, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.55);
    });
  } catch { /* Audio not available */ }
}

/**
 * Pre-load voices (Chrome needs this).
 */
export function initAudio() {
  if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }
}
