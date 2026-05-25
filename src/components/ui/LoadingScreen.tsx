"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Power } from "lucide-react";
import Button from "./Button";
import { useSoundEffect } from "@/hooks/useSoundEffect";

interface LoadingScreenProps {
  onComplete: () => void;
}

const BOOT_LOGS = [
  "Initializing anv os kernel...",
  "Loading graphics components...",
  "Connecting to Firestore streams...",
  "Mounting tech portfolio registry...",
  "Configuring dynamic inputs...",
  "Synchronizing global lobby...",
  "Boot complete! Launching desktop..."
];

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Dynamic progress bar loading sequence
    const duration = 2400; // 2.4 seconds total boot
    const intervalTime = 40;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progressPercent = Math.min((currentStep / steps) * 100, 100);
      
      // Add natural velocity variations
      let dynamicProgress = progressPercent;
      if (progressPercent < 40) {
        dynamicProgress = progressPercent * 1.2;
      } else if (progressPercent >= 40 && progressPercent < 80) {
        dynamicProgress = 48 + (progressPercent - 40) * 0.6;
      } else {
        dynamicProgress = 72 + (progressPercent - 80) * 1.4;
      }

      const finalProgress = Math.min(Math.round(dynamicProgress), 100);
      setProgress(finalProgress);

      // Dynamically cycle through boot log messages based on progress ranges
      const segmentSize = 100 / BOOT_LOGS.length;
      const currentLog = Math.min(
        Math.floor(finalProgress / segmentSize),
        BOOT_LOGS.length - 1
      );
      setLogIndex(currentLog);

      if (currentStep >= steps || finalProgress >= 100) {
        clearInterval(timer);
        // Hold at 100% briefly, then auto-fade out
        setTimeout(() => {
          setIsVisible(false);
          const event = new CustomEvent('enterSite');
          window.dispatchEvent(event);
        }, 500);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-zinc-950 text-white select-none overflow-hidden"
        >
          
          {/* DESKTOP VIEWPORT */}
          <div className="hidden md:flex flex-col items-center max-w-md w-full px-8">
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [0.98, 1, 0.98],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mb-8 p-5 border rounded-2xl flex items-center justify-center shadow-lg bg-white/[0.03] border-white/10"
            >
              <Terminal className="w-10 h-10 text-emerald-400" />
            </motion.div>

            <div className="w-full bg-zinc-900/60 border border-white/5 rounded-xl py-3 px-4 mb-6 font-mono text-[11px] text-zinc-400 h-32 flex flex-col justify-end gap-2 shadow-inner overflow-hidden">
              {BOOT_LOGS.slice(Math.max(0, logIndex - 3), logIndex + 1).map((log, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={idx}
                  className={`truncate leading-relaxed ${idx === logIndex ? "text-emerald-400" : ""}`}
                >
                  <span className="text-zinc-600 mr-1.5">&gt;</span>
                  {log}
                </motion.div>
              ))}
            </div>

            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-3">
              <motion.div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${progress}%` }}
                layoutId="progressBar"
              />
            </div>

            <div className="flex justify-between w-full text-[10px] text-zinc-500 font-semibold tracking-wider uppercase h-10 items-start">
              <div className="flex justify-between w-full">
                <span>anv os starting</span>
                <span>{progress}%</span>
              </div>
            </div>
          </div>

          {/* MOBILE VIEWPORT */}
          <div className="flex md:hidden flex-col items-center justify-center px-6">
            <div className="relative w-24 h-24 flex items-center justify-center mb-8">
              <motion.div 
                animate={{
                  scale: [1, 1.25, 1],
                  opacity: [0.1, 0.25, 0.1],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-emerald-500 rounded-full"
              />
              
              <svg className="w-full h-full rotate-[-90deg]">
                <circle cx="48" cy="48" r="36" className="stroke-white/10" strokeWidth="3.5" fill="transparent" />
                <motion.circle
                  cx="48"
                  cy="48"
                  r="36"
                  className="stroke-emerald-400"
                  strokeWidth="3.5"
                  fill="transparent"
                  strokeDasharray="226"
                  strokeDashoffset={226 - (226 * progress) / 100}
                />
              </svg>
              
              <div className="absolute text-emerald-400 font-bold text-lg select-none">
                {progress}%
              </div>
            </div>

            <div className="h-12 flex justify-center w-full">
              <span className="text-xs font-semibold text-zinc-400 tracking-widest uppercase mt-4">
                Loading Portfolio
              </span>
            </div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
