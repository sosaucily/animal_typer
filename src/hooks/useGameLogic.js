import { useState, useCallback, useEffect, useRef } from 'react';
import { ALPHABET_DATA } from '../data/animals';
import { saveTime } from '../utils/scores';
import {
  speakLetter,
  speakSuccess,
  playSuccessChime,
  playBoop,
  playFanfare,
  initAudio,
  stopAudio,
} from '../utils/audioManager';

/**
 * Game phases:
 * - 'waiting'   : Showing the target letter, waiting for key press
 * - 'success'   : Correct key pressed, showing animal + banner
 * - 'finale'    : All 26 letters complete, grand celebration
 */
export function useGameLogic(paused = false) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState('waiting');
  const [completedLetters, setCompletedLetters] = useState([]);
  const [lastWrongKey, setLastWrongKey] = useState(null);
  const advanceTimerRef = useRef(null);
  const phraseTimerRef = useRef(null);
  const wrongTimerRef = useRef(null);
  const roundRef = useRef(0);

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

  useEffect(() => {
    if (!paused) return;
    const beganAt = Date.now();
    return () => {
      if (startTimeRef.current !== null) startTimeRef.current += Date.now() - beganAt;
    };
  }, [paused]);

  // Ignore gameplay input while the parent recorder is open.
  const handleKeyPress = useCallback(
    (key) => {
      if (paused) return;
      if (phase === 'finale') return;
      if (phase === 'success') return;

      const pressedLetter = key.toUpperCase();

      if (!/^[A-Z]$/.test(pressedLetter)) return;

      // Start the clock on the very first letter key the child presses.
      if (startTimeRef.current === null) {
        startTimeRef.current = Date.now();
      }

      if (pressedLetter === currentData.letter) {
        const round = roundRef.current;
        const beganAt = Date.now();
        setPhase('success');
        setLastWrongKey(null);
        playSuccessChime();

        phraseTimerRef.current = setTimeout(async () => {
          await speakSuccess(currentData.letter, currentData.animal);
          if (round !== roundRef.current) return;
          // Keep the reward visible for at least 3.5 seconds and let long takes finish.
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
          }, Math.max(400, 3500 - (Date.now() - beganAt)));
        }, 300);
      } else {
        setLastWrongKey(pressedLetter);
        speakLetter(pressedLetter);
        playBoop();

        clearTimeout(wrongTimerRef.current);
        wrongTimerRef.current = setTimeout(() => setLastWrongKey(null), 800);
      }
    },
    [phase, currentData, currentIndex, paused]
  );

  // The listener follows the current phase; timers have their own unmount cleanup.
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey || e.target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT', 'A'].includes(e.target.tagName)) return;
      handleKeyPress(e.key);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleKeyPress]);

  // Cleanup advance timer on unmount only
  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
      clearTimeout(phraseTimerRef.current);
      clearTimeout(wrongTimerRef.current);
      roundRef.current += 1;
      stopAudio();
    };
  }, []);

  // Restart the game
  const restart = useCallback(() => {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    clearTimeout(phraseTimerRef.current);
    clearTimeout(wrongTimerRef.current);
    roundRef.current += 1;
    stopAudio();
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
