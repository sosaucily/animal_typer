import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import ShadowBox from './components/ShadowBox';
import LetterStage from './components/LetterStage';
import ProgressTracker from './components/ProgressTracker';
import OnScreenKeyboard from './components/OnScreenKeyboard';
import GrandFinale from './components/GrandFinale';
import { useGameLogic } from './hooks/useGameLogic';

export default function App() {
  const {
    currentData,
    currentIndex,
    phase,
    completedLetters,
    lastWrongKey,
    handleKeyPress,
    restart,
    totalLetters,
  } = useGameLogic();

  // Detect touch devices to show on-screen keyboard
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const hasTouchScreen =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0;

    // Also check if it's a small screen (likely tablet/phone)
    const isSmallScreen = window.innerWidth < 1024;

    setIsTouchDevice(hasTouchScreen && isSmallScreen);
  }, []);

  return (
    <div
      className="w-full h-full flex flex-col font-body"
      style={{
        background: 'linear-gradient(180deg, #EDE7F6 0%, #E8EAF6 50%, #E3F2FD 100%)',
      }}
    >
      {/* Title bar */}
      <header className="flex items-center justify-center py-2 sm:py-3 px-4 relative z-20">
        <h1
          className="font-display font-bold tracking-tight"
          style={{
            fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
            background: 'linear-gradient(135deg, #E74C3C, #F39C12, #F1C40F, #27AE60, #2980B9, #8E44AD)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))',
          }}
        >
          Alphabet Zoo
        </h1>

        {/* Letter count */}
        <div
          className="absolute right-4 font-display text-sm opacity-50"
        >
          {completedLetters.length}/{totalLetters}
        </div>
      </header>

      {/* Main shadowbox stage */}
      <ShadowBox bgColor={currentData.bg}>
        <LetterStage
          currentData={currentData}
          phase={phase}
          lastWrongKey={lastWrongKey}
        />
      </ShadowBox>

      {/* On-screen keyboard for touch devices */}
      <OnScreenKeyboard
        onKeyPress={handleKeyPress}
        targetLetter={currentData.letter}
        visible={isTouchDevice && phase !== 'finale'}
      />

      {/* Progress tracker */}
      {phase !== 'finale' && (
        <ProgressTracker
          currentIndex={currentIndex}
          completedLetters={completedLetters}
        />
      )}

      {/* Grand Finale overlay */}
      <AnimatePresence>
        {phase === 'finale' && (
          <GrandFinale onRestart={restart} />
        )}
      </AnimatePresence>
    </div>
  );
}
