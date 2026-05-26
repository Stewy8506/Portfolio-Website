"use client";

import React from "react";

export default function NoiseOverlay() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes noise-anim {
          0% { transform: translate3d(0, 0, 0); }
          10% { transform: translate3d(-5%, -5%, 0); }
          20% { transform: translate3d(-10%, 5%, 0); }
          30% { transform: translate3d(5%, -10%, 0); }
          40% { transform: translate3d(-5%, 15%, 0); }
          50% { transform: translate3d(-10%, 5%, 0); }
          60% { transform: translate3d(15%, 0, 0); }
          70% { transform: translate3d(0, 15%, 0); }
          80% { transform: translate3d(5%, 5%, 0); }
          90% { transform: translate3d(-10%, 5%, 0); }
          100% { transform: translate3d(5%, 0, 0); }
        }
        .noise-bg {
          animation: noise-anim 0.8s steps(2) infinite;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
      `}} />
      <div 
        className="pointer-events-none fixed inset-[-50%] z-50 opacity-[0.04] mix-blend-overlay noise-bg" 
        style={{ willChange: 'transform' }}
      />
    </>
  );
}
