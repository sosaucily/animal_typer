import { motion } from 'framer-motion';

/**
 * ShadowBox - the main stage wrapper that creates the layered
 * papercut/shadowbox aesthetic. Multiple paper layers with depth.
 */
export default function ShadowBox({ children, bgColor = '#FFF8E7' }) {
  return (
    <div className="relative flex-1 flex items-center justify-center p-4 overflow-hidden">
      {/* Outermost shadow frame */}
      <div
        className="absolute inset-3 sm:inset-6 rounded-3xl"
        style={{
          background: 'rgba(0,0,0,0.08)',
          filter: 'blur(8px)',
        }}
      />

      {/* Back layer - darkest */}
      <div
        className="absolute inset-4 sm:inset-8 rounded-2xl paper-texture"
        style={{
          background: '#2C3E50',
          boxShadow: 'var(--shadow-paper-xl)',
        }}
      />

      {/* Middle layer */}
      <motion.div
        className="absolute inset-6 sm:inset-12 rounded-xl paper-texture"
        style={{
          background: '#34495E',
          boxShadow: 'var(--shadow-paper-lg)',
        }}
        animate={{ rotate: [-0.3, 0.3, -0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Front layer - the actual stage */}
      <motion.div
        className="relative z-10 w-full h-full max-w-4xl mx-auto rounded-xl overflow-hidden paper-texture"
        style={{
          background: bgColor,
          boxShadow:
            'var(--shadow-paper-lg), inset 0 2px 4px rgba(255,255,255,0.5), inset 0 -2px 4px rgba(0,0,0,0.05)',
          margin: '16px',
        }}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {/* Inner shadow border effect */}
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            boxShadow: 'var(--shadow-paper-inset)',
          }}
        />

        {/* Decorative corner cuts */}
        <div className="absolute top-2 left-2 w-4 h-4 rounded-full opacity-10 bg-black" />
        <div className="absolute top-2 right-2 w-4 h-4 rounded-full opacity-10 bg-black" />
        <div className="absolute bottom-2 left-2 w-4 h-4 rounded-full opacity-10 bg-black" />
        <div className="absolute bottom-2 right-2 w-4 h-4 rounded-full opacity-10 bg-black" />

        {/* Content */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4 sm:p-6">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
