/**
 * Performance optimization utilities
 */

// Debounce function for scroll and resize events
export function debounce(func, wait = 100) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for frequent events
export function throttle(func, limit = 100) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Request animation frame throttle for smooth animations
export function rafThrottle(callback) {
  let requestId = null;
  let lastArgs;

  const later = (context) => () => {
    requestId = null;
    callback.apply(context, lastArgs);
  };

  const throttled = function (...args) {
    lastArgs = args;
    if (requestId === null) {
      requestId = requestAnimationFrame(later(this));
    }
  };

  throttled.cancel = () => {
    cancelAnimationFrame(requestId);
    requestId = null;
  };

  return throttled;
}

// Lazy load images with Intersection Observer
export function lazyLoadImage(img) {
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading
    img.loading = 'lazy';
  } else {
    // Fallback to Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const lazyImage = entry.target;
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.classList.remove('lazy');
            observer.unobserve(lazyImage);
          }
        });
      },
      { rootMargin: '50px' }
    );
    observer.observe(img);
  }
}

// Detect device capabilities
export function getDeviceCapabilities() {
  if (typeof window === 'undefined') return { isLowEnd: false, prefersReducedMotion: false };
  
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Detect low-end devices
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const slowConnection = connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g';
  
  const cpuCores = navigator.hardwareConcurrency || 2;
  const lowCPU = cpuCores <= 2;
  
  const memory = navigator.deviceMemory;
  const lowMemory = memory ? memory <= 2 : false;
  
  const isLowEnd = slowConnection || lowCPU || lowMemory;
  
  return {
    isLowEnd,
    prefersReducedMotion,
    cpuCores,
    memory,
    connection: connection?.effectiveType || 'unknown',
  };
}

// Adaptive animation settings
export function getAdaptiveAnimationSettings() {
  const { isLowEnd, prefersReducedMotion } = getDeviceCapabilities();
  
  if (prefersReducedMotion) {
    return {
      duration: 0,
      enabled: false,
      reducedMotion: true,
    };
  }
  
  if (isLowEnd) {
    return {
      duration: 150,
      enabled: true,
      reducedMotion: false,
      quality: 'low',
      fps: 30,
    };
  }
  
  return {
    duration: 300,
    enabled: true,
    reducedMotion: false,
    quality: 'high',
    fps: 60,
  };
}

// Preload critical resources
export function preloadResource(href, as, type = null) {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (type) link.type = type;
  document.head.appendChild(link);
}

// Check if element is in viewport
export function isInViewport(element, offset = 0) {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= -offset &&
    rect.left >= -offset &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) + offset
  );
}

// Intersection Observer hook helper
export function createIntersectionObserver(callback, options = {}) {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }
  
  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.01,
    ...options,
  });
}

// Prefetch on hover/focus for better UX
export function prefetchOnInteraction(href) {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
}

// Measure performance
export function measurePerformance(name, callback) {
  if (typeof window === 'undefined' || !window.performance) {
    return callback();
  }
  
  const startMark = `${name}-start`;
  const endMark = `${name}-end`;
  
  performance.mark(startMark);
  const result = callback();
  performance.mark(endMark);
  
  try {
    performance.measure(name, startMark, endMark);
  } catch (e) {
    // Ignore errors
  }
  
  return result;
}

// Clean up performance marks
export function cleanupPerformanceMarks(name) {
  if (typeof window === 'undefined' || !window.performance) return;
  
  try {
    performance.clearMarks(name);
    performance.clearMeasures(name);
  } catch (e) {
    // Ignore errors
  }
}

// Dynamic import with retry
export async function dynamicImportWithRetry(importFn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await importFn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

// Bundle size analyzer helper
export function logBundleSize(name, size) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`📦 ${name}: ${(size / 1024).toFixed(2)} KB`);
  }
}
