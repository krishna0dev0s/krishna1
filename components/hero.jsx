"use client";

import React, { useEffect, useRef, memo } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import PixelBlastOptimized from "./PixelBlastOptimized";
import { throttle } from "@/lib/performance-utils";
import { AdaptiveMotion } from "./adaptive-animation";
import { usePerformance } from "@/hooks/use-performance";

const HeroSection = () => {
  const { capabilities, shouldReduceMotion } = usePerformance();
  const isLowEnd = capabilities?.isLowEnd;
  const imageRef = useRef(null);
  
  useEffect(() => {
    const imageElement = imageRef.current;
    if (!imageElement) return;
    
    const handleScroll = throttle(() => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;
      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    }, 100);
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  return (
    <section className="w-full pt-16 md:pt-20 pb-16 md:pb-20 relative overflow-hidden -mt-10 md:-mt-16 bg-gradient-to-b from-background via-background/70 to-muted/50 text-foreground">
      {/* PixelBlast Background - Optimized or disabled on low-end */}
      <div 
        className="absolute inset-0 -z-10 h-[220px] md:h-[260px]" 
        style={{ width: '100%', position: 'relative' }}
      >
        {isLowEnd || shouldReduceMotion ? (
          <div className="w-full h-full bg-gradient-to-br from-primary/15 via-primary/8 to-transparent" />
        ) : (
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
        )}
      </div>

      {/* Soft accent glows */}
      {!isLowEnd && !shouldReduceMotion && (
        <div className="pointer-events-none absolute inset-0 -z-[5] opacity-50">
          <div className="absolute left-1/4 top-12 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute right-1/4 top-24 h-48 w-48 rounded-full bg-accent/30 blur-3xl" />
        </div>
      )}

      <div className="space-y-3 md:space-y-5 text-center container mx-auto px-4 relative z-10">
        {/* Headline with adaptive animations */}
        <div className="space-y-4 md:space-y-5 hero-content max-w-5xl mx-auto">
          <AdaptiveMotion 
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-primary/10 text-primary text-sm font-semibold border border-primary/20 shadow-sm">
              <span role="img" aria-label="sparkles">✨</span> AI-first career copilot
            </div>
            <h1 className="text-3xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mt-3 text-pretty">
              <span className="bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">Welcome to WatshiBo</span>
              <br />
              <span className="text-foreground">Your Ultimate AI-Powered Study Companion</span>
            </h1>
          </AdaptiveMotion>
          
          <AdaptiveMotion 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="mx-auto max-w-4xl bg-card/70 backdrop-blur-md border border-border/70 rounded-2xl px-5 md:px-6 py-4 shadow-lg shadow-primary/5">
              <p className="mt-2 md:mt-3 text-lg md:text-xl lg:text-2xl font-medium text-muted-foreground text-pretty">
                Master interviews, craft standout resumes, and tailor cover letters — all powered by intelligent automation.
              </p>
            </div>
          </AdaptiveMotion>
        </div>

        {/* CTA Buttons with adaptive animations */}
        <AdaptiveMotion
          className="flex flex-col sm:flex-row justify-center gap-4 pt-5 md:pt-7 hero-buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button 
            asChild 
            size="lg" 
            className={`w-full sm:w-auto px-8 transition-all duration-300 ${isLowEnd || shouldReduceMotion ? '' : 'hover:scale-105 hover:shadow-xl'} will-change-transform bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border border-primary/40 shadow-lg shadow-primary/20`}
          >
            <Link href="/dashboard" prefetch={true}>Get Started</Link>
          </Button>
          <Button 
            asChild 
            size="lg" 
            className={`w-full sm:w-auto px-8 transition-all duration-300 ${isLowEnd || shouldReduceMotion ? '' : 'hover:scale-105 hover:shadow-lg'} will-change-transform border border-border bg-card/70 backdrop-blur`} 
            variant="outline"
          >
            <Link href="/dashboard" prefetch={true}>Learn More</Link>
          </Button>
        </AdaptiveMotion>
      </div>
    </section>
  );
};

export default memo(HeroSection);
