"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { twMerge } from "tailwind-merge";

interface LaptopMockupProps extends HTMLMotionProps<"div"> {
  src?: string;
  alt?: string;
  children?: React.ReactNode;
}

export function LaptopMockup({ src, alt, children, className, ...props }: LaptopMockupProps) {
  return (
    <motion.div
      className={twMerge("flex flex-col items-center justify-center w-full mx-auto", className)}
      {...props}
    >
      <div
        className="relative w-full rounded-t-[0.75rem] md:rounded-t-[1rem] overflow-hidden p-[10px] md:p-[12px] shadow-2xl"
        style={{
          background: "linear-gradient(145deg, #2a2a2e 0%, #1a1a1e 40%, #0f0f12 100%)",
          boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 40px 100px -16px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.12)",
        }}
      >

        {/* Screen */}
        <div className="relative rounded-sm md:rounded-md overflow-hidden bg-black" style={{ aspectRatio: "16/9" }}>
          {src ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={src} alt={alt || "Screenshot"} className="w-full h-full object-cover object-top" draggable={false} />
          ) : children}
          <div className="absolute inset-0 pointer-events-none rounded-sm md:rounded-md" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%, rgba(0,0,0,0.15) 100%)" }} />
        </div>
      </div>

      {/* Laptop Base (Keyboard area) */}
      <div className="relative w-[112%] h-[2vw] min-h-[12px] md:h-5 rounded-b-[0.5rem] md:rounded-b-[1.25rem] flex items-start justify-center z-10"
        style={{
          background: "linear-gradient(to bottom, #2a2a2e 0%, #1a1a1e 100%)",
          boxShadow: "0 10px 30px -10px rgba(0,0,0,0.8), inset 0 1px 2px rgba(255,255,255,0.15)"
        }}
      >
        <div className="w-[15%] md:w-32 h-[20%] md:h-1.5 bg-black/30 rounded-b-xl backdrop-blur-md" />
      </div>
    </motion.div>
  );
}
