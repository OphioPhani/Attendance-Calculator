'use client';
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

const TextShimmer = ({
  children,
  className,
  duration = 2,
  spread = 100,
}) => {
  const words = useMemo(() => {
    if (typeof children === 'string') {
      return children.split(' ');
    }
    return [];
  }, [children]);

  return (
    <div className={cn('inline-block', className)}>
      {words.map((word, idx) => (
        <span key={idx} className="inline-block">
          <motion.span
            className={cn(
              'inline-block bg-gradient-to-r',
              '[--base-color:theme(colors.blue.600)]',
              '[--base-gradient-color:theme(colors.blue.200)]',
              'from-[var(--base-color)] via-[var(--base-gradient-color)] to-[var(--base-color)]',
              'bg-clip-text text-transparent'
            )}
            style={{
              backgroundSize: `200% 200%`,
            }}
            animate={{
              backgroundPosition: ['200% 0%', '-200% 0%'],
            }}
            transition={{
              duration,
              repeat: Infinity,
              ease: 'linear',
              delay: (idx * spread) / 1000,
            }}
          >
            {word}
          </motion.span>
          {idx < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </div>
  );
};

TextShimmer.displayName = 'TextShimmer';

export default TextShimmer;
