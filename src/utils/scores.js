/**
 * Persistence + formatting for game completion times.
 *
 * Times are stored in browser localStorage as a JSON array of entries,
 * fastest first, capped at the top 10. Everything degrades gracefully:
 * unavailable/corrupt storage just yields an empty list rather than throwing.
 */

const STORAGE_KEY = 'alphabet-zoo-top-times';
export const MAX_ENTRIES = 10;

/**
 * Read the saved times, sorted fastest-first and capped to MAX_ENTRIES.
 * @returns {{ ms: number, date: number }[]}
 */
export function loadTopTimes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((e) => e && typeof e.ms === 'number' && Number.isFinite(e.ms) && e.ms >= 0)
      .sort((a, b) => a.ms - b.ms)
      .slice(0, MAX_ENTRIES);
  } catch {
    return [];
  }
}

/**
 * Record a finish time and return the updated leaderboard.
 *
 * @param {number} ms   Elapsed time in milliseconds.
 * @param {number} date Timestamp (ms since epoch) of the run.
 * @returns {{
 *   topTimes: { ms: number, date: number }[],
 *   currentEntry: { ms: number, date: number },
 *   rank: number,
 *   madeList: boolean,
 *   isNewBest: boolean,
 * }}
 */
export function saveTime(ms, date) {
  const existing = loadTopTimes();
  const currentEntry = { ms, date };

  // Stable sort keeps `currentEntry` after any equal existing time, so a tie
  // never counts as a new best.
  const merged = [...existing, currentEntry].sort((a, b) => a.ms - b.ms);
  const rank = merged.indexOf(currentEntry) + 1;
  const topTimes = merged.slice(0, MAX_ENTRIES);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(topTimes));
  } catch {
    // Storage may be full or blocked (private mode); the run still shows its
    // time, it just won't persist.
  }

  return {
    topTimes,
    currentEntry,
    rank,
    madeList: rank <= MAX_ENTRIES,
    isNewBest: rank === 1,
  };
}

/**
 * Format a duration in ms as `M:SS` (e.g. 83000 -> "1:23").
 * @param {number} ms
 * @returns {string}
 */
export function formatTime(ms) {
  const safe = Number.isFinite(ms) && ms >= 0 ? ms : 0;
  const totalSeconds = Math.floor(safe / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}
