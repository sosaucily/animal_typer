import { motion } from 'framer-motion';
import { ALPHABET_DATA } from '../data/animals';

/**
 * ProgressTracker - an A-Z trail at the bottom of the screen
 * with a moving paper pawn showing current position.
 */
export default function ProgressTracker({ currentIndex, completedLetters }) {
  return (
    <div className="w-full px-2 sm:px-4 py-2 sm:py-3">
      <div
        className="relative flex items-center justify-center gap-0.5 sm:gap-1 px-3 py-2 sm:py-3 rounded-xl mx-auto max-w-3xl"
        style={{
          background: 'rgba(44, 62, 80, 0.9)',
          boxShadow: 'var(--shadow-paper-md), inset 0 2px 4px rgba(0,0,0,0.3)',
        }}
      >
        {/* Trail path line */}
        <div
          className="absolute left-6 right-6 h-0.5 rounded-full opacity-20"
          style={{ background: 'white', top: '50%', transform: 'translateY(-50%)' }}
        />

        {/* Progress fill */}
        <motion.div
          className="absolute left-6 h-1 rounded-full"
          style={{
            background: 'linear-gradient(90deg, #F1C40F, #F39C12, #E74C3C)',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
          animate={{
            width: `${(completedLetters.length / ALPHABET_DATA.length) * (100 - 4)}%`,
          }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />

        {ALPHABET_DATA.map((item, index) => {
          const isCompleted = completedLetters.includes(item.letter);
          const isCurrent = index === currentIndex;

          return (
            <motion.div
              key={item.letter}
              className="relative z-10 flex items-center justify-center rounded-full font-display font-bold text-xs leading-none"
              style={{
                width: 'clamp(16px, 3vw, 26px)',
                height: 'clamp(16px, 3vw, 26px)',
                fontSize: 'clamp(7px, 1.3vw, 11px)',
                background: isCompleted
                  ? item.color
                  : isCurrent
                    ? '#FFF8E7'
                    : 'rgba(255,255,255,0.15)',
                color: isCompleted
                  ? 'white'
                  : isCurrent
                    ? item.color
                    : 'rgba(255,255,255,0.4)',
                boxShadow: isCurrent
                  ? `0 0 0 2px ${item.color}, var(--shadow-paper-sm)`
                  : isCompleted
                    ? 'var(--shadow-paper-sm)'
                    : 'none',
              }}
              animate={
                isCurrent
                  ? {
                      scale: [1, 1.15, 1],
                      y: [0, -2, 0],
                    }
                  : {}
              }
              transition={
                isCurrent
                  ? {
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }
                  : {}
              }
            >
              {item.letter}

              {/* Pawn indicator for current letter */}
              {isCurrent && (
                <motion.div
                  className="absolute -top-3 w-0 h-0"
                  style={{
                    borderLeft: '4px solid transparent',
                    borderRight: '4px solid transparent',
                    borderTop: `6px solid ${item.color}`,
                  }}
                  animate={{ y: [0, -2, 0] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
