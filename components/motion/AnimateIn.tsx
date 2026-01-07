'use client';

import { motion } from 'framer-motion';

interface AnimateInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
}

export function AnimateIn({
  children,
  delay = 0,
  duration = 0.5,
  direction = 'up',
  className = ''
}: AnimateInProps) {
  const variants = {
    hidden: {
      opacity: 0,
      x: direction === 'left' ? -20 : direction === 'right' ? 20 : 0,
      y: direction === 'up' ? 20 : direction === 'down' ? -20 : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
