'use client';

import { motion } from 'framer-motion';
import { usePerformance } from '@/hooks/use-performance';

/**
 * Adaptive animation wrapper that adjusts based on device capabilities
 */
export function AdaptiveMotion({ 
  children, 
  className = '',
  initial = { opacity: 0, y: 20 },
  animate = { opacity: 1, y: 0 },
  transition = { duration: 0.3 },
  ...props 
}) {
  const { animationSettings, shouldReduceMotion } = usePerformance();

  // Disable animations if reduced motion is preferred
  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  // Adjust transition based on device capabilities
  const adaptiveTransition = {
    ...transition,
    duration: animationSettings.duration / 1000,
  };

  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={adaptiveTransition}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger children animation with performance optimization
 */
export function AdaptiveStagger({ 
  children, 
  staggerDelay = 0.1,
  className = '',
}) {
  const { shouldReduceMotion } = usePerformance();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={className}
    >
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <motion.div key={index} variants={item}>
            {child}
          </motion.div>
        ))
      ) : (
        <motion.div variants={item}>{children}</motion.div>
      )}
    </motion.div>
  );
}

/**
 * Fade in on scroll with performance optimization
 */
export function AdaptiveFadeIn({ 
  children, 
  className = '',
  delay = 0,
  threshold = 0.1,
}) {
  const { shouldReduceMotion } = usePerformance();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: threshold }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
