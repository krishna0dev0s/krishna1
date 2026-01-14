"use client";

import React, { useEffect, useRef, memo } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import PixelBlastOptimized from "./PixelBlastOptimized";
import { throttle } from "@/lib/performance-utils";
import { AdaptiveMotion } from "./adaptive-animation";

const HeroSection = () => {
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
    <section className="w-full pt-8 pb-8 text-white relative overflow-hidden -mt-16">
      {/* PixelBlast Background - Optimized */}
      <div 
        className="absolute inset-0 -z-10" 
        style={{ width: '100%', height: '250px', position: 'relative' }}
      >
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

      <div className="space-y-3 md:space-y-4 text-center container mx-auto px-4 relative z-10">
        {/* Headline with adaptive animations */}
        <div className="space-y-3 md:space-y-4 hero-content">
          <AdaptiveMotion 
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight metallic-text">
              Welcome to WatshiBo
              <br />
              <span className="metallic-blue">
                Your Ultimate AI-Powered Study Companion
              </span>
            </h1>
          </AdaptiveMotion>
          
          <AdaptiveMotion 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="mt-2 md:mt-3 text-lg md:text-xl lg:text-2xl font-medium max-w-3xl mx-auto text-gray-100">
              Master interviews, craft standout resumes, and tailor cover letters.
              all powered by intelligent automation.
            </p>
          </AdaptiveMotion>
        </div>

        {/* CTA Buttons with adaptive animations */}
        <AdaptiveMotion
          className="flex flex-col sm:flex-row justify-center gap-4 pt-2 md:pt-3 hero-buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button 
            asChild 
            size="lg" 
            className="px-8 transition-all duration-300 hover:scale-105 hover:shadow-lg will-change-transform"
          >
            <Link href="/dashboard" prefetch={true}>Get Started</Link>
          </Button>
          <Button 
            asChild 
            size="lg" 
            className="px-8 transition-all duration-300 hover:scale-105 hover:shadow-lg will-change-transform" 
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
