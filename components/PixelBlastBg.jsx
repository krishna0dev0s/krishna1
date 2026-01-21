"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Load the optimized wrapper only on the client to avoid bundling Three.js upfront
const PixelBlastOptimized = dynamic(() => import('./PixelBlastOptimized'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
  ),
});

export default function PixelBlastBg() {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Skip the heavy background on small screens or when reduced motion is preferred
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setShouldRender(isDesktop && !prefersReducedMotion);
  }, []);

  if (!shouldRender) {
    return (
      <div className="fixed inset-0 -z-20 w-full h-screen pointer-events-none bg-gradient-to-b from-background via-background to-background" />
    );
  }

  return (
    <div className="fixed inset-0 -z-20 w-full h-screen pointer-events-none">
      <PixelBlastOptimized
        variant="circle"
        pixelSize={6}
        color="#B19EEF"
        patternScale={3}
        patternDensity={1.2}
        pixelSizeJitter={0.5}
        enableRipples
        rippleSpeed={0.4}
        rippleThickness={0.12}
        rippleIntensityScale={1.5}
        liquid
        liquidStrength={0.12}
        liquidRadius={1.2}
        liquidWobbleSpeed={5}
        speed={0.6}
        edgeFade={0.25}
        transparent
      />
    </div>
  );
}
