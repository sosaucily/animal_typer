import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ALPHABET_DATA, getAnimalSVG } from '../data/animals';
import { formatTime } from '../utils/scores';

const MEDALS = ['🥇', '🥈', '🥉'];

function formatDate(ms) {
  try {
    return new Date(ms).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

/**
 * GrandFinale - full-screen celebration once all 26 letters are complete.
 * Features confetti, the finish time, a top-10 leaderboard, a parade of all
 * animals, and a restart button.
 */
export default function GrandFinale({
  onRestart,
  finishTime,
  topTimes = [],
  currentEntry = null,
  isNewBest = false,
}) {
  const confettiRef = useRef(false);

  useEffect(() => {
    if (confettiRef.current) return;
    confettiRef.current = true;

    // Big initial burst
    const defaults = { startVelocity: 30, spread: 360, ticks: 100, zIndex: 9999 };

    confetti({
      ...defaults,
      particleCount: 100,
      origin: { x: 0.5, y: 0.3 },
      colors: ['#E74C3C', '#F39C12', '#F1C40F', '#27AE60', '#2980B9', '#8E44AD', '#E91E90'],
    });

    // Follow-up bursts
    const intervals = [500, 1200, 2000, 3000];
    const timers = intervals.map((delay) =>
      setTimeout(() => {
        confetti({
          ...defaults,
          particleCount: 50,
          origin: { x: Math.random(), y: Math.random() * 0.4 },
          colors: ['#E74C3C', '#F39C12', '#F1C40F', '#27AE60', '#2980B9', '#8E44AD'],
        });
      }, delay)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background confetti paper pieces */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`bg-${i}`}
          className="absolute rounded-sm"
          style={{
            width: Math.random() * 20 + 10,
            height: Math.random() * 20 + 10,
            background: ALPHABET_DATA[i % 26].color,
            opacity: 0.2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 3 + Math.random() * 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Foreground content — scrolls if it outgrows short screens */}
      <div className="relative z-10 flex flex-col items-center w-full max-h-full overflow-y-auto px-4 py-6">
        {/* Title */}
        <motion.h1
          className="font-display font-bold text-white text-center mb-2"
          style={{
            fontSize: 'clamp(2rem, 8vw, 4.5rem)',
            textShadow: '4px 4px 0px rgba(0,0,0,0.2), 8px 8px 16px rgba(0,0,0,0.15)',
          }}
          initial={{ y: -100, scale: 0 }}
          animate={{ y: 0, scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 15,
            delay: 0.3,
          }}
        >
          You Did It!
        </motion.h1>

        <motion.p
          className="font-display text-white/80 text-lg sm:text-2xl mb-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          All 26 letters complete!
        </motion.p>

        {/* Finish ticket — the signature moment */}
        <motion.div
          className="relative mb-6"
          initial={{ y: 30, scale: 0.8, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          transition={{ delay: 1.0, type: 'spring', stiffness: 200, damping: 16 }}
        >
          <div
            className="paper-edge flex flex-col items-center px-8 py-4"
            style={{
              background: 'rgba(255,255,255,0.96)',
              boxShadow: 'var(--shadow-paper-lg)',
              borderRadius: 20,
            }}
          >
            <span className="font-display font-bold text-sm sm:text-base uppercase tracking-wide text-slate-500">
              ⏱ Your time
            </span>
            <span
              className="font-display font-bold leading-none text-slate-800"
              style={{ fontSize: 'clamp(2.5rem, 11vw, 4rem)' }}
            >
              {finishTime != null ? formatTime(finishTime) : '—'}
            </span>
          </div>

          {isNewBest && (
            <div
              className="animate-stamp absolute -top-4 -right-4 font-display font-bold text-white text-sm sm:text-base px-3 py-1"
              style={{
                background: 'linear-gradient(135deg, #F1C40F, #F39C12)',
                boxShadow: 'var(--shadow-paper-md)',
                borderRadius: 999,
                border: '2px solid rgba(255,255,255,0.7)',
                transform: 'rotate(8deg)',
              }}
            >
              🏆 New Best!
            </div>
          )}
        </motion.div>

        {/* Animal parade - scrolling horizontal strip */}
        <motion.div
          className="w-full overflow-hidden py-2 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            className="flex gap-4 px-4"
            animate={{ x: [0, -2600] }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {/* Double the animals for seamless loop */}
            {[...ALPHABET_DATA, ...ALPHABET_DATA].map((item, i) => {
              const AnimalComponent = getAnimalSVG(item.letter);
              return (
                <motion.div
                  key={`parade-${i}`}
                  className="flex-shrink-0 flex flex-col items-center gap-1"
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: (i % 26) * 0.1,
                  }}
                >
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl p-1 paper-edge"
                    style={{
                      background: 'rgba(255,255,255,0.9)',
                      boxShadow: 'var(--shadow-paper-sm)',
                    }}
                  >
                    {AnimalComponent && <AnimalComponent color={item.color} />}
                  </div>
                  <span
                    className="font-display font-bold text-xs text-white/90"
                    style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
                  >
                    {item.letter}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Top-10 leaderboard */}
        {topTimes.length > 0 && (
          <motion.div
            className="paper-edge w-full max-w-sm mb-6 overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.96)',
              boxShadow: 'var(--shadow-paper-lg)',
              borderRadius: 20,
            }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            <h2 className="font-display font-bold text-center text-slate-700 text-lg pt-4 pb-2">
              🏅 Fastest Times
            </h2>
            <ol className="pb-3">
              {topTimes.map((entry, i) => {
                const isYou = entry === currentEntry;
                return (
                  <li
                    key={`${entry.date}-${i}`}
                    className="flex items-center gap-3 px-5 py-2 font-display"
                    style={
                      isYou
                        ? {
                            background: 'linear-gradient(135deg, #F1C40F33, #F39C1233)',
                            boxShadow: 'inset 3px 0 0 #F39C12',
                          }
                        : undefined
                    }
                  >
                    <span className="w-7 text-center text-lg font-bold text-slate-400 shrink-0">
                      {MEDALS[i] ?? i + 1}
                    </span>
                    <span
                      className={`flex-1 text-xl font-bold ${
                        isYou ? 'text-slate-900' : 'text-slate-700'
                      }`}
                    >
                      {formatTime(entry.ms)}
                    </span>
                    {isYou && (
                      <span
                        className="text-[0.65rem] font-bold text-white uppercase tracking-wide px-2 py-0.5 shrink-0"
                        style={{
                          background: 'linear-gradient(135deg, #F39C12, #E74C3C)',
                          borderRadius: 999,
                        }}
                      >
                        You
                      </span>
                    )}
                    <span className="text-xs text-slate-400 shrink-0 w-14 text-right">
                      {formatDate(entry.date)}
                    </span>
                  </li>
                );
              })}
            </ol>
          </motion.div>
        )}

        {/* Restart button */}
        <motion.button
          onClick={onRestart}
          className="px-8 py-4 rounded-2xl font-display font-bold text-xl sm:text-2xl text-white paper-edge cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #F39C12, #E74C3C)',
            boxShadow: 'var(--shadow-paper-lg)',
            border: '3px solid rgba(255,255,255,0.3)',
          }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.6, type: 'spring', stiffness: 200 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Play Again!
        </motion.button>
      </div>
    </motion.div>
  );
}
