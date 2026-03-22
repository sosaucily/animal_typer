/**
 * AudioManager
 *
 * Audio priority:
 *   1. Pre-recorded .mp3 files in /public/audio/
 *   2. SpeechSynthesis fallback if the file is missing
 *
 * Expected file naming convention:
 *   /public/audio/letter-A.mp3      → speaks the letter "A"
 *   /public/audio/phrase-A.mp3      → speaks "A is for Aardvark!"
 *   /public/audio/success.mp3       → success chime  (optional)
 *   /public/audio/boop.mp3          → wrong-key boop (optional)
 *   /public/audio/fanfare.mp3       → grand finale   (optional)
 */

let audioCtx = null;
let currentAudio = null; // track the currently playing Audio element

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Try to play a pre-recorded file. Returns true if the file exists, false otherwise.
 */
function playFile(path) {
  return new Promise((resolve) => {
    // Stop any currently playing audio clip
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }

    const audio = new Audio(path);
    currentAudio = audio;

    audio.addEventListener('canplaythrough', () => {
      audio.play();
      resolve(true);
    }, { once: true });

    audio.addEventListener('error', () => {
      currentAudio = null;
      resolve(false);
    }, { once: true });
  });
}

// ── Speech fallbacks ────────────────────────────────────────────────

function speakWithSynthesis(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.85;
  utterance.pitch = 1.2;
  utterance.volume = 1;

  const voices = window.speechSynthesis.getVoices();
  const preferred =
    voices.find((v) => v.lang.startsWith('en') && v.name.includes('Samantha')) ||
    voices.find((v) => v.lang.startsWith('en-US')) ||
    voices.find((v) => v.lang.startsWith('en'));

  if (preferred) utterance.voice = preferred;
  window.speechSynthesis.speak(utterance);
}

// ── Public API ──────────────────────────────────────────────────────

/**
 * Speak a single letter name.
 * Tries /audio/letter-A.mp3 first, falls back to SpeechSynthesis.
 */
export async function speakLetter(letter) {
  const played = await playFile(`/audio/letter-${letter.toUpperCase()}.mp3`);
  if (!played) {
    speakWithSynthesis(letter.toUpperCase());
  }
}

/**
 * Speak a phrase like "A is for Aardvark!"
 * Tries /audio/phrase-A.mp3 first, falls back to SpeechSynthesis.
 */
export async function speakPhrase(letter, animal) {
  const played = await playFile(`/audio/phrase-${letter.toUpperCase()}.mp3`);
  if (!played) {
    speakWithSynthesis(`${letter.toUpperCase()} is for ${animal}!`);
  }
}

/**
 * Play a success chime. Tries /audio/success.mp3, falls back to synthesized chime.
 */
export async function playSuccessChime() {
  const played = await playFile('/audio/success.mp3');
  if (!played) {
    synthesizeSuccessChime();
  }
}

/**
 * Play a wrong-key boop. Tries /audio/boop.mp3, falls back to synthesized boop.
 */
export async function playBoop() {
  const played = await playFile('/audio/boop.mp3');
  if (!played) {
    synthesizeBoop();
  }
}

/**
 * Play grand finale fanfare. Tries /audio/fanfare.mp3, falls back to synthesized.
 */
export async function playFanfare() {
  const played = await playFile('/audio/fanfare.mp3');
  if (!played) {
    synthesizeFanfare();
  }
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
