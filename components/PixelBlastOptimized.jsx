'use client';

import { useEffect, useRef, memo } from 'react';
import { useAdaptiveQuality } from '@/hooks/use-performance';
import dynamic from 'next/dynamic';

// Lazy load the full PixelBlast only for high-end devices
const PixelBlastFull = dynamic(() => import('./PixelBlast'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />,
});

/**
 * Optimized PixelBlast wrapper with device detection
 */
function PixelBlastOptimized(props) {
  const quality = useAdaptiveQuality();
  const canvasRef = useRef(null);

  // Use CSS gradient fallback for low-end devices
  if (quality === 'low') {
    return (
      <div 
        className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent animate-gradient"
        style={{
          backgroundSize: '400% 400%',
        }}
      />
    );
  }

  // Use simplified canvas for medium devices
  if (quality === 'medium') {
    return <SimplifiedPixelBlast {...props} canvasRef={canvasRef} />;
  }

  // Use full PixelBlast for high-end devices
  return <PixelBlastFull {...props} />;
}

/**
 * Simplified canvas animation for medium-end devices
 */
function SimplifiedPixelBlast({ color = '#B19EEF', canvasRef }) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    const width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    const height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    let animationId;
    let particles = [];
    const particleCount = 30; // Reduced from potentially hundreds

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.3;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
          this.reset();
        }
      }

      draw() {
        ctx.fillStyle = `${color}${Math.floor(this.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.fillRect(this.x, this.y, this.size, this.size);
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      animationId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      particles = [];
    };
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ opacity: 0.6 }}
    />
  );
}

export default memo(PixelBlastOptimized);
