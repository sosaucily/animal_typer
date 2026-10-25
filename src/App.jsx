import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Mic } from 'lucide-react';
import ShadowBox from './components/ShadowBox';
import LetterStage from './components/LetterStage';
import ProgressTracker from './components/ProgressTracker';
import OnScreenKeyboard from './components/OnScreenKeyboard';
import GrandFinale from './components/GrandFinale';
import VoiceStudio from './components/VoiceStudio';
import { useGameLogic } from './hooks/useGameLogic';
import { stopAudio } from './utils/audioManager';

export default function App() {
  const [studioOpen, setStudioOpen] = useState(false);
  const {
    currentData,
    currentIndex,
    phase,
    completedLetters,
    lastWrongKey,
    handleKeyPress,
    restart,
    totalLetters,
    finishTime,
    topTimes,
    currentEntry,
    isNewBest,
  } = useGameLogic(studioOpen);

  // Detect touch devices to show on-screen keyboard
  const [isTouchDevice] = useState(() => ('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth < 1024);

  return (
    <><div
      inert={studioOpen}
      className="w-full h-full flex flex-col font-body"
      style={{
        background: 'linear-gradient(180deg, #EDE7F6 0%, #E8EAF6 50%, #E3F2FD 100%)',
      }}
    >
      {/* Title bar */}
      <header className="flex items-center justify-center py-2 sm:py-3 px-4 relative z-20">
        <button id="open-voice-studio" aria-label="Voice studio" className="studio-launch" disabled={phase === 'success' || phase === 'finale'} onClick={() => { stopAudio(); setStudioOpen(true); }}><Mic size={16} /><span>Voice studio</span></button>
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
          <GrandFinale
            onRestart={restart}
            finishTime={finishTime}
            topTimes={topTimes}
            currentEntry={currentEntry}
            isNewBest={isNewBest}
          />
        )}
      </AnimatePresence>
    </div>{studioOpen && <VoiceStudio onClose={() => { setStudioOpen(false); requestAnimationFrame(() => document.getElementById('open-voice-studio')?.focus()); }} />}</>
  );
}
