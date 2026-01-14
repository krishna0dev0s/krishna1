'use client';

import { useState, useEffect, useRef } from 'react';
import { getDeviceCapabilities, getAdaptiveAnimationSettings } from '@/lib/performance-utils';

/**
 * Hook to manage performance optimizations
 */
export function usePerformance() {
  const [capabilities, setCapabilities] = useState({
    isLowEnd: false,
    prefersReducedMotion: false,
  });
  
  const [animationSettings, setAnimationSettings] = useState({
    duration: 300,
    enabled: true,
    reducedMotion: false,
  });

  useEffect(() => {
    const deviceCaps = getDeviceCapabilities();
    const animSettings = getAdaptiveAnimationSettings();
    
    setCapabilities(deviceCaps);
    setAnimationSettings(animSettings);
  }, []);

  return {
    capabilities,
    animationSettings,
    shouldReduceMotion: capabilities.prefersReducedMotion || capabilities.isLowEnd,
  };
}

/**
 * Hook for intersection observer with performance optimizations
 */
export function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const targetRef = useRef(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [hasIntersected, options]);

  return { targetRef, isIntersecting, hasIntersected };
}

/**
 * Hook for lazy loading components
 */
export function useLazyLoad(delay = 0) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const { targetRef, hasIntersected } = useIntersectionObserver();

  useEffect(() => {
    if (hasIntersected) {
      if (delay > 0) {
        const timer = setTimeout(() => setShouldLoad(true), delay);
        return () => clearTimeout(timer);
      } else {
        setShouldLoad(true);
      }
    }
  }, [hasIntersected, delay]);

  return { targetRef, shouldLoad };
}

/**
 * Hook for adaptive quality based on device
 */
export function useAdaptiveQuality() {
  const [quality, setQuality] = useState('high');
  const { capabilities } = usePerformance();

  useEffect(() => {
    if (capabilities.isLowEnd) {
      setQuality('low');
    } else if (capabilities.cpuCores <= 4) {
      setQuality('medium');
    } else {
      setQuality('high');
    }
  }, [capabilities]);

  return quality;
}

/**
 * Hook to track FPS and performance
 */
export function useFrameRate() {
  const [fps, setFps] = useState(60);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    let animationFrameId;

    const measureFPS = () => {
      frameCount.current++;
      const currentTime = performance.now();
      const elapsed = currentTime - lastTime.current;

      if (elapsed >= 1000) {
        setFps(Math.round((frameCount.current * 1000) / elapsed));
        frameCount.current = 0;
        lastTime.current = currentTime;
      }

      animationFrameId = requestAnimationFrame(measureFPS);
    };

    animationFrameId = requestAnimationFrame(measureFPS);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return fps;
}

/**
 * Hook for prefetching on hover
 */
export function usePrefetchOnHover() {
  const prefetch = (href) => {
    if (typeof window === 'undefined') return;
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  };

  return { prefetch };
}
