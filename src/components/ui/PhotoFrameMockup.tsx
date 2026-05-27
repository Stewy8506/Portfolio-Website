"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { twMerge } from "tailwind-merge";

interface PhotoFrameMockupProps extends HTMLMotionProps<"div"> {
  src?: string;
  alt?: string;
  children?: React.ReactNode;
}

export function PhotoFrameMockup({ src, alt, children, className, ...props }: PhotoFrameMockupProps) {
  return (
    <motion.div
      className={twMerge("flex flex-col items-center justify-center w-full mx-auto", className)}
      {...props}
    >
      {/* Outer frame (PCB Board look) */}
      <div
        className="relative w-full rounded-xl md:rounded-2xl overflow-hidden p-[4%] md:p-[24px] shadow-2xl border border-cyan-900/30"
        style={{
          background: "#0a192f", // Deep navy/cyan-tinted background
          boxShadow: "0 0 0 1px rgba(6,182,212,0.1), 0 40px 100px -16px rgba(0,0,0,0.95), inset 0 1px 0 rgba(6,182,212,0.2)",
        }}
      >
        {/* Circuitry SVG Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.15] pointer-events-none"
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2306b6d4' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
               backgroundSize: "60px 60px"
             }}
        />

        {/* Circuitry traces accents */}
        <div className="absolute top-6 left-6 w-16 h-16 border-t-[3px] border-l-[3px] border-emerald-500/40 rounded-tl-xl pointer-events-none" />
        <div className="absolute bottom-6 right-6 w-16 h-16 border-b-[3px] border-r-[3px] border-emerald-500/40 rounded-br-xl pointer-events-none" />
        
        {/* Golden Contacts / Mounting holes */}
        <div className="absolute top-4 right-4 w-4 h-4 rounded-full bg-amber-500/20 border-2 border-amber-500/40 pointer-events-none shadow-[0_0_10px_rgba(245,158,11,0.2)]" />
        <div className="absolute bottom-4 left-4 w-4 h-4 rounded-full bg-amber-500/20 border-2 border-amber-500/40 pointer-events-none shadow-[0_0_10px_rgba(245,158,11,0.2)]" />
        <div className="absolute top-4 left-4 w-4 h-4 rounded-full bg-amber-500/20 border-2 border-amber-500/40 pointer-events-none shadow-[0_0_10px_rgba(245,158,11,0.2)]" />
        <div className="absolute bottom-4 right-4 w-4 h-4 rounded-full bg-amber-500/20 border-2 border-amber-500/40 pointer-events-none shadow-[0_0_10px_rgba(245,158,11,0.2)]" />

        {/* Inner Bezel Screen */}
        <div className="relative rounded-md md:rounded-lg overflow-hidden bg-black ring-1 ring-white/20 shadow-inner z-10" style={{ aspectRatio: "4/3" }}>
          {src ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={src} alt={alt || "Screenshot"} className="w-full h-full object-cover" draggable={false} />
          ) : children}
          <div className="absolute inset-0 pointer-events-none rounded-md md:rounded-lg" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(0,0,0,0.3) 100%)" }} />
          
          {/* Subtle Glass reflection */}
          <div className="absolute inset-0 pointer-events-none rounded-md md:rounded-lg opacity-30"
               style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.8) 45%, rgba(255,255,255,0.8) 48%, transparent 53%)" }} 
          />
        </div>
      </div>

      {/* Frame Stand / Base */}
      <div className="relative w-[60%] md:w-[40%] h-[4vw] min-h-[20px] md:h-8 rounded-b-xl flex items-start justify-center z-10"
        style={{
          background: "linear-gradient(to bottom, #1e293b 0%, #0f172a 100%)",
          boxShadow: "0 10px 30px -10px rgba(0,0,0,0.8), inset 0 1px 2px rgba(255,255,255,0.15)"
        }}
      >
        {/* Status LEDs on the base */}
        <div className="flex gap-3 mt-2.5">
           <div className="w-2 h-2 rounded-full bg-red-500/90 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
           <div className="w-2 h-2 rounded-full bg-emerald-500/90 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
}
