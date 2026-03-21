import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GlowCard } from './GlowCard.jsx';

export const EnhancedGlowCard = ({
  children,
  className = '',
  glowColor = 'blue',
  size = 'md',
  width,
  height,
  customSize = false,
}) => {
  const [hovered, setHovered] = useState(false);

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

      {/* Simple hover overlay */}
      <AnimatePresence>
        {hovered && (
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