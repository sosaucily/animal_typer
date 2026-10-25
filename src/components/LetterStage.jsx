import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import AnimalPicture from './AnimalPicture';
import images from '../data/animalImages.json';

const CONFETTI_COLORS = [
  '#E74C3C', '#F39C12', '#F1C40F', '#27AE60',
  '#2980B9', '#8E44AD', '#E91E90', '#1ABC9C',
];

/**
 * LetterStage pairs each target letter with an animal photo postcard.
 * Correct keys celebrate with an animated phrase and confetti.
 */
export default function LetterStage({ currentData, phase, lastWrongKey }) {
  const { letter, animal, color } = currentData;
  const firedRef = useRef(false);

  // Fire confetti when entering success phase
  useEffect(() => {
    if (phase !== 'success') {
      firedRef.current = false;
      return;
    }
    if (firedRef.current) return;
    firedRef.current = true;

    // Initial burst from center
    confetti({
      particleCount: 60,
      spread: 80,
      origin: { x: 0.5, y: 0.45 },
      colors: CONFETTI_COLORS,
      zIndex: 9999,
    });

    // Side cannons with slight delay
    const t1 = setTimeout(() => {
      confetti({
        particleCount: 30,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: CONFETTI_COLORS,
        zIndex: 9999,
      });
      confetti({
        particleCount: 30,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: CONFETTI_COLORS,
        zIndex: 9999,
      });
    }, 250);

    return () => clearTimeout(t1);
  }, [phase]);

  return (
    <div className="letter-stage">
      <div className="stage-eyebrow"><span className="stage-dot" style={{ background: color }} /> A little alphabet adventure</div>
      <div className="letter-stage-grid">
        <div className="letter-stage-instructions">
          <AnimatePresence mode="wait">
            <motion.div key={`${letter}-${phase}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <p className="stage-prompt">{phase === 'success' ? 'You found it!' : 'Can you find this letter?'}</p>
              <motion.span className="target-letter" style={{ color }} animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>{letter}</motion.span>
              {phase === 'success'
                ? <p className="stage-success">{letter} is for<br /><strong>{animal}!</strong></p>
                : <p className="stage-key-hint">Press <kbd>{letter}</kbd> on your keyboard</p>}
            </motion.div>
          </AnimatePresence>
          <div className="wrong-key-slot" aria-live="polite">
            {lastWrongKey && <p>That’s <strong>{lastWrongKey}</strong>. Try <strong>{letter}</strong>!</p>}
          </div>
        </div>
        <motion.div key={letter} className="animal-postcard" initial={{ opacity: 0, rotate: 2, y: 15 }} animate={{ opacity: 1, rotate: phase === 'success' ? -1 : 0, y: 0, scale: phase === 'success' ? 1.025 : 1 }} transition={{ type: 'spring', stiffness: 170, damping: 20 }}>
          <div className="postcard-photo"><AnimalPicture key={letter} letter={letter} showCredit /><span className="postcard-number">{String(letter.charCodeAt(0) - 64).padStart(2, '0')} / 26</span></div>
          <div className="postcard-caption"><div><p className="eyebrow">{letter === 'U' ? 'A storybook friend' : 'Meet your zoo friend'}</p><h2>{animal}</h2></div><span className="postcard-letter" style={{ background: color }}>{letter}</span></div>
          <p className="postcard-habitat">{images[letter]?.habitat}</p>
        </motion.div>
      </div>
      <p className="stage-footer">Little keys. Big discoveries.</p>
    </div>
  );
}
