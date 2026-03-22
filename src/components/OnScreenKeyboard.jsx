import { motion } from 'framer-motion';

/**
 * OnScreenKeyboard - a tablet/touch fallback that displays
 * tappable letter keys in a QWERTY-ish layout for toddlers.
 * Only shown when no physical keyboard is detected.
 */
const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

const KEY_COLORS = {
  Q: '#E74C3C', W: '#F39C12', E: '#F1C40F', R: '#27AE60',
  T: '#2980B9', Y: '#8E44AD', U: '#E91E90', I: '#1ABC9C',
  O: '#E67E22', P: '#FF6B6B', A: '#2980B9', S: '#27AE60',
  D: '#E74C3C', F: '#F39C12', G: '#8E44AD', H: '#1ABC9C',
  J: '#F1C40F', K: '#E91E90', L: '#2980B9', Z: '#8E44AD',
  X: '#E74C3C', C: '#27AE60', V: '#F39C12', B: '#2980B9',
  N: '#E91E90', M: '#1ABC9C',
};

export default function OnScreenKeyboard({ onKeyPress, targetLetter, visible }) {
  if (!visible) return null;

  return (
    <motion.div
      className="w-full px-1 pb-2"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
    >
      {ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1 mb-1">
          {row.map((key) => {
            const isTarget = key === targetLetter;
            const keyColor = KEY_COLORS[key];

            return (
              <motion.button
                key={key}
                onClick={() => onKeyPress(key)}
                className="rounded-lg font-display font-bold text-white select-none"
                style={{
                  width: 'clamp(28px, 8vw, 42px)',
                  height: 'clamp(32px, 9vw, 46px)',
                  fontSize: 'clamp(12px, 3.5vw, 18px)',
                  background: keyColor,
                  boxShadow: isTarget
                    ? `0 0 0 3px white, 0 0 0 5px ${keyColor}, var(--shadow-paper-sm)`
                    : 'var(--shadow-paper-sm)',
                  border: '2px solid rgba(255,255,255,0.2)',
                }}
                whileTap={{ scale: 0.9, y: 2 }}
                animate={
                  isTarget
                    ? { scale: [1, 1.08, 1] }
                    : {}
                }
                transition={
                  isTarget
                    ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
                    : {}
                }
              >
                {key}
              </motion.button>
            );
          })}
        </div>
      ))}
    </motion.div>
  );
}
