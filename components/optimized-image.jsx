'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useIntersectionObserver } from '@/hooks/use-performance';

/**
 * Optimized Image component with lazy loading and blur placeholder
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 75,
  placeholder = 'blur',
  blurDataURL,
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { targetRef, hasIntersected } = useIntersectionObserver({ threshold: 0.01 });

  // Don't lazy load priority images
  const shouldLoad = priority || hasIntersected;

  return (
    <div ref={targetRef} className={`relative overflow-hidden ${className}`}>
      {shouldLoad && (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          quality={quality}
          priority={priority}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          onLoad={() => setIsLoaded(true)}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          {...props}
        />
      )}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-muted animate-pulse"
          style={{ width, height }}
        />
      )}
    </div>
  );
}

/**
 * Optimized background image component
 */
export function OptimizedBackgroundImage({ 
  src, 
  alt = '', 
  className = '', 
  children,
  priority = false,
  quality = 60,
}) {
  const { targetRef, hasIntersected } = useIntersectionObserver();
  const shouldLoad = priority || hasIntersected;

  return (
    <div ref={targetRef} className={`relative ${className}`}>
      {shouldLoad && (
        <Image
          src={src}
          alt={alt}
          fill
          quality={quality}
          priority={priority}
          className="object-cover"
          sizes="100vw"
        />
      )}
      {children}
    </div>
  );
}
