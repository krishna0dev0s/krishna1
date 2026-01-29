"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Load the optimized wrapper only on the client to avoid bundling Three.js upfront
const PixelBlastOptimized = dynamic(() => import('./PixelBlastOptimized'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0" style={{
      background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(0,0,0,0.08))",
    }} />
  ),
});

export default function PixelBlastBg() {
  // Disabled to keep the palette strictly monochrome and remove residual color cast.
  return null;
}
