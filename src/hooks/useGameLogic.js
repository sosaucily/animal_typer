import { useState, useCallback, useEffect, useRef } from 'react';
import { ALPHABET_DATA } from '../data/animals';
import { saveTime } from '../utils/scores';
import {
  speakLetter,
  speakPhrase,
  playSuccessChime,
  playBoop,
  playFanfare,
  initAudio,
} from '../utils/audioManager';

/**
 * Game phases:
 * - 'waiting'   : Showing the target letter, waiting for key press
 * - 'success'   : Correct key pressed, showing animal + banner
 * - 'finale'    : All 26 letters complete, grand celebration
 */
export function useGameLogic() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState('waiting');
  const [completedLetters, setCompletedLetters] = useState([]);
  const [lastWrongKey, setLastWrongKey] = useState(null);
  const advanceTimerRef = useRef(null);

  // Timing: the clock starts on the child's first key press and stops when
  // the final letter is completed. `startTimeRef` is null until they begin.
  const startTimeRef = useRef(null);
  const [finishTime, setFinishTime] = useState(null); // elapsed ms for this run
  const [topTimes, setTopTimes] = useState([]);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [isNewBest, setIsNewBest] = useState(false);

  const currentData = ALPHABET_DATA[currentIndex] || ALPHABET_DATA[0];

  // Init audio on mount
  useEffect(() => {
    initAudio();
  }, []);

  // Handle keydown — use refs so the callback identity is stable
  // and the keyboard listener effect doesn't re-run on state changes
  const handleKeyPress = useCallback(
    (key) => {
      if (phase === 'finale') return;
      if (phase === 'success') return;

      const pressedLetter = key.toUpperCase();

      if (!/^[A-Z]$/.test(pressedLetter)) return;

      // Start the clock on the very first letter key the child presses.
      if (startTimeRef.current === null) {
        startTimeRef.current = Date.now();
      }

      if (pressedLetter === currentData.letter) {
        setPhase('success');
        setLastWrongKey(null);
        playSuccessChime();

        setTimeout(() => {
          speakPhrase(currentData.letter, currentData.animal);
        }, 300);

        // Advance to next letter after the success sequence plays
        advanceTimerRef.current = setTimeout(() => {
          setCompletedLetters((prev) => [...prev, currentData.letter]);

          if (currentIndex + 1 >= ALPHABET_DATA.length) {
            const now = Date.now();
            const elapsed = now - (startTimeRef.current ?? now);
            const result = saveTime(elapsed, now);
            setFinishTime(elapsed);
            setTopTimes(result.topTimes);
            setCurrentEntry(result.currentEntry);
            setIsNewBest(result.isNewBest);
            setPhase('finale');
            playFanfare();
          } else {
            setCurrentIndex((prev) => prev + 1);
            setPhase('waiting');
          }
        }, 3500);
      } else {
        setLastWrongKey(pressedLetter);
        speakLetter(pressedLetter);
        playBoop();

        setTimeout(() => setLastWrongKey(null), 800);
      }
    },
    [phase, currentData, currentIndex]
  );

  // Use a ref so the keyboard listener always calls the latest handler
  // without needing to re-attach the event listener on every state change.
  // This prevents the effect cleanup from running and killing timers.
  const handleKeyPressRef = useRef(handleKeyPress);
  handleKeyPressRef.current = handleKeyPress;

  // Keyboard listener — runs once on mount, never re-runs
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      handleKeyPressRef.current(e.key);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Cleanup advance timer on unmount only
  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    };
  }, []);

  // Restart the game
  const restart = useCallback(() => {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    setCurrentIndex(0);
    setPhase('waiting');
    setCompletedLetters([]);
    setLastWrongKey(null);
    startTimeRef.current = null;
    setFinishTime(null);
    setCurrentEntry(null);
    setIsNewBest(false);
  }, []);

  return {
    currentData,
    currentIndex,
    phase,
    completedLetters,
    lastWrongKey,
    handleKeyPress,
    restart,
    totalLetters: ALPHABET_DATA.length,
    finishTime,
    topTimes,
    currentEntry,
    isNewBest,
  };
}
