import React, { useState, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GlowCard } from './GlowCard.jsx';

// Lazy load Canvas effect only when needed
const CanvasRevealEffect = React.lazy(() =>
  import('./CanvasRevealEffect.jsx').then(mod => ({ default: mod.CanvasRevealEffect }))
);

// Fallback while Canvas is loading
const CanvasLoadingFallback = () => null;

export const EnhancedGlowCard = ({
  children,
  className = '',
  glowColor = 'blue',
  size = 'md',
  width,
  height,
  customSize = false,
  canvasColor = [0, 200, 255],
  animationSpeed = 3,
  showCanvasEffect = false, // Disabled by default for stability
}) => {
  const [hovered, setHovered] = useState(false);

  const colorMap = {
    blue: [0, 200, 255],
    purple: [100, 150, 255],
    green: [0, 200, 100],
    red: [255, 80, 100],
    orange: [255, 150, 50],
  };

  const effectColor = canvasColor || colorMap[glowColor] || [0, 200, 255];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden group rounded-2xl"
    >
      <GlowCard
        glowColor={glowColor}
        size={size}
        width={width}
        height={height}
        customSize={customSize}
        className={`relative z-10 ${className}`}
      >
        {children}
      </GlowCard>

      {/* Canvas Reveal Effect with AnimatePresence and Suspense */}
      <AnimatePresence>
        {hovered && showCanvasEffect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
          >
            <Suspense fallback={<CanvasLoadingFallback />}>
              <CanvasRevealEffect
                animationSpeed={animationSpeed}
                containerClassName="bg-black/50 dark:bg-black/80"
                colors={[effectColor]}
                dotSize={2}
                showGradient={true}
              />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay gradient for depth */}
      <AnimatePresence>
        {hovered && showCanvasEffect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedGlowCard;
