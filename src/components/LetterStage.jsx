import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { getAnimalSVG } from '../data/animals';

const CONFETTI_COLORS = [
  '#E74C3C', '#F39C12', '#F1C40F', '#27AE60',
  '#2980B9', '#8E44AD', '#E91E90', '#1ABC9C',
];

/**
 * LetterStage - displays the big target letter and, on success,
 * reveals the animal with a bouncy papercut animation + confetti.
 */
export default function LetterStage({ currentData, phase, lastWrongKey }) {
  const { letter, animal, color } = currentData;
  const AnimalComponent = getAnimalSVG(letter);
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
    <div className="flex-1 flex flex-col items-center justify-center w-full relative">
      <AnimatePresence mode="popLayout">
        {phase === 'waiting' && (
          <motion.div
            key={`letter-${letter}`}
            className="flex flex-col items-center gap-2"
            initial={{ scale: 0, rotate: -12 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotate: 8 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
            }}
          >
            {/* Hint text */}
            <motion.p
              className="text-lg sm:text-xl font-display opacity-50 tracking-wide"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 0.5, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Press the letter...
            </motion.p>

            {/* Big letter */}
            <motion.div
              className="relative"
              animate={{
                y: [0, -6, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <span
                className="font-display font-bold select-none leading-none block"
                style={{
                  fontSize: 'clamp(8rem, 25vw, 16rem)',
                  color: color,
                  textShadow: `4px 4px 0px rgba(0,0,0,0.15), 8px 8px 16px rgba(0,0,0,0.1)`,
                  WebkitTextStroke: '2px rgba(0,0,0,0.08)',
                }}
              >
                {letter}
              </span>

              {/* Paper shadow beneath the letter */}
              <div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-4 rounded-full"
                style={{
                  background: 'rgba(0,0,0,0.08)',
                  filter: 'blur(6px)',
                }}
              />
            </motion.div>

            {/* Wrong key indicator */}
            <AnimatePresence>
              {lastWrongKey && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="mt-2 px-4 py-2 rounded-xl font-display text-lg paper-edge"
                  style={{
                    background: 'rgba(255,255,255,0.8)',
                    boxShadow: 'var(--shadow-paper-sm)',
                  }}
                >
                  <span className="opacity-60">That&apos;s</span>{' '}
                  <span className="font-bold" style={{ color }}>
                    {lastWrongKey}
                  </span>
                  <span className="opacity-60">, try </span>
                  <span className="font-bold" style={{ color }}>
                    {letter}
                  </span>
                  <span className="opacity-60">!</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {phase === 'success' && (
          <motion.div
            key={`success-${letter}`}
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            {/* Banner */}
            <motion.div
              className="px-6 py-3 rounded-2xl font-display text-xl sm:text-3xl font-bold paper-edge"
              style={{
                background: color,
                color: 'white',
                boxShadow: 'var(--shadow-paper-lg)',
                textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
              }}
              initial={{ y: -50, scale: 0, rotate: -5 }}
              animate={{ y: 0, scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 15,
              }}
            >
              {letter} is for {animal}!
            </motion.div>

            {/* Animal SVG */}
            {AnimalComponent && (
              <motion.div
                className="w-40 h-40 sm:w-56 sm:h-56"
                initial={{ x: 300, rotate: 15, opacity: 0 }}
                animate={{ x: 0, rotate: 0, opacity: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 18,
                  delay: 0.2,
                }}
                style={{
                  filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.2))',
                }}
              >
                <AnimalComponent color={color} />
              </motion.div>
            )}

            {/* Stars / sparkle accents */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-sm"
                style={{
                  background: color,
                  opacity: 0.6,
                  rotate: '45deg',
                }}
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0,
                }}
                animate={{
                  x: (Math.random() - 0.5) * 300,
                  y: (Math.random() - 0.5) * 200,
                  scale: [0, 1.5, 0],
                  rotate: [45, 45 + 360],
                }}
                transition={{
                  duration: 1.5,
                  delay: 0.1 * i,
                  ease: 'easeOut',
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
