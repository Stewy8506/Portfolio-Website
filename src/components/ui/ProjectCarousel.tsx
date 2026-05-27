"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { LaptopMockup } from "./LaptopMockup";
import { PhotoFrameMockup } from "./PhotoFrameMockup";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const AUTO_INTERVAL = 4000; // ms between slides

interface ProjectCarouselProps {
  images: string[];
  imageType?: "phone" | "desktop" | "embedded" | "auto";
}

// ─── Shared: Nav Arrow Button ─────────────────────────────────────────────────
function NavButton({
  direction,
  onClick,
  visible = true,
  small = false,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  visible?: boolean;
  small?: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.93 }}
      className={cn(
        "relative flex items-center justify-center rounded-full",
        "bg-white/8 backdrop-blur-xl border border-white/12",
        "text-white/70 hover:text-white",
        "shadow-[0_4px_24px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)]",
        "hover:bg-white/14 hover:border-white/20",
        "transition-colors duration-200",
        small ? "p-2" : "p-3",
        !visible && "opacity-0 pointer-events-none"
      )}
      aria-label={direction === "prev" ? "Previous slide" : "Next slide"}
    >
      {direction === "prev" ? (
        <ChevronLeft className={small ? "w-4 h-4" : "w-5 h-5"} strokeWidth={2.2} />
      ) : (
        <ChevronRight className={small ? "w-4 h-4" : "w-5 h-5"} strokeWidth={2.2} />
      )}
    </motion.button>
  );
}

// ─── Shared: Progress Dot Indicators ─────────────────────────────────────────
function ProgressDots({
  count,
  current,
  progress,
  onSelect,
}: {
  count: number;
  current: number;
  progress: number; // 0–1, progress of the current slide's timer
  onSelect: (idx: number) => void;
}) {
  if (count <= 1) return null;
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: count }).map((_, idx) => {
        const isActive = idx === current;
        return (
          <button
            key={idx}
            onClick={() => onSelect(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={cn(
              "relative h-1.5 rounded-full overflow-hidden transition-all duration-400",
              isActive ? "w-8 bg-white/15" : "w-1.5 bg-white/20 hover:bg-white/40"
            )}
          >
            {isActive && (
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-emerald-400"
                initial={{ width: "0%" }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 0, ease: "linear" }}
                style={{ width: `${progress * 100}%` }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Phone Mockup Frame ───────────────────────────────────────────────────────
function PhoneFrame({ src, alt, index }: { src: string; alt: string; index: number }) {
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative flex-shrink-0"
      style={{ width: "min(280px, 72vw)" }}
    >
      {/* Phone outer shell */}
      <div
        className="relative rounded-[2rem] overflow-hidden select-none"
        style={{
          background: "linear-gradient(145deg, #2a2a2e 0%, #1a1a1e 40%, #0f0f12 100%)",
          padding: "3px",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.08), 0 32px 80px -12px rgba(0,0,0,0.9), 0 0 60px -20px rgba(6,182,212,0.08), inset 0 1px 0 rgba(255,255,255,0.12)",
        }}
      >
        {/* Side button – volume up */}
        <div
          className="absolute -left-[3px] top-[88px] w-[3px] h-8 rounded-l-full"
          style={{ background: "linear-gradient(180deg, #3a3a3e, #252528)" }}
        />
        {/* Side button – volume down */}
        <div
          className="absolute -left-[3px] top-[132px] w-[3px] h-8 rounded-l-full"
          style={{ background: "linear-gradient(180deg, #3a3a3e, #252528)" }}
        />
        {/* Side button – power */}
        <div
          className="absolute -right-[3px] top-[108px] w-[3px] h-12 rounded-r-full"
          style={{ background: "linear-gradient(180deg, #3a3a3e, #252528)" }}
        />

        {/*
          CORNER RADIUS:
          • Outer shell  → change "rounded-[2.5rem]"  on the outer <div> above
          • Inner screen → change "rounded-[2.25rem]" on the inner <div> below
          Tip: keep inner ~0.25rem smaller than outer so the bezel gap is visible.
        */}
        {/* Inner bezel */}
        <div
          className="relative rounded-[1.9rem] overflow-hidden"
          style={{ background: "#000" }}
        >
          {/* Screen content */}
          <div className="relative" style={{ aspectRatio: "9/19.5" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-cover object-top"
              draggable={false}
            />
            {/* Screen reflection overlay */}
            <div
              className="absolute inset-0 pointer-events-none rounded-[1.9rem]"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%, rgba(0,0,0,0.15) 100%)",
              }}
            />
          </div>
        </div>

        {/* Outer shell reflection */}
        <div
          className="absolute inset-0 rounded-[2rem] pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 40%)",
          }}
        />
      </div>

      {/* Ground shadow */}
      <div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-4 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, transparent 70%)",
          filter: "blur(8px)",
        }}
      />
    </motion.div>
  );
}

// ─── Desktop / Default Mode ───────────────────────────────────────────────────
function DesktopCarousel({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const rafRef = useRef<number | null>(null);

  const goTo = useCallback(
    (idx: number) => {
      setCurrentIndex(idx);
      setProgress(0);
      startTimeRef.current = Date.now();
    },
    []
  );

  const goNext = useCallback(
    () => goTo((currentIndex + 1) % images.length),
    [currentIndex, images.length, goTo]
  );

  const goPrev = useCallback(
    () => goTo((currentIndex - 1 + images.length) % images.length),
    [currentIndex, images.length, goTo]
  );

  // Auto-advance via requestAnimationFrame for smooth progress
  useEffect(() => {
    if (images.length <= 1) return;

    const tick = () => {
      if (!paused) {
        const elapsed = Date.now() - startTimeRef.current;
        const p = Math.min(elapsed / AUTO_INTERVAL, 1);
        setProgress(p);
        if (p >= 1) {
          setCurrentIndex((prev) => (prev + 1) % images.length);
          setProgress(0);
          startTimeRef.current = Date.now();
        }
      } else {
        // Keep updating startTime so progress doesn't jump on resume
        startTimeRef.current = Date.now() - progress * AUTO_INTERVAL;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [images.length, paused, progress]);

  return (
    <div
      className="relative w-full group pt-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <LaptopMockup className="max-w-4xl">
        <motion.div
          className="flex w-full h-full"
          animate={{ x: `-${currentIndex * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {images.map((img, idx) => (
            <div key={idx} className="w-full h-full flex-shrink-0 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={`Project image ${idx + 1}`}
                className="w-full h-full object-cover object-top"
                draggable={false}
              />
            </div>
          ))}
        </motion.div>
      </LaptopMockup>

      {images.length > 1 && (
        <>
          {/* Prev button */}
          <div className="absolute inset-y-0 left-0 md:-left-4 flex items-center px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <NavButton direction="prev" onClick={goPrev} />
          </div>
          {/* Next button */}
          <div className="absolute inset-y-0 right-0 md:-right-4 flex items-center px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <NavButton direction="next" onClick={goNext} />
          </div>
          {/* Bottom indicators */}
          <div className="absolute -bottom-8 inset-x-0 flex justify-center z-10">
            <ProgressDots
              count={images.length}
              current={currentIndex}
              progress={progress}
              onSelect={goTo}
            />
          </div>
        </>
      )}
    </div>
  );
}

// ─── Phone Gallery Mode ───────────────────────────────────────────────────────
function PhoneCarousel({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const rafRef = useRef<number | null>(null);

  // Swipe gesture tracking
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setPaused(true);
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX; // Initialize end with start
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    setPaused(false);
    if (!touchStartX.current || !touchEndX.current) return;

    const diff = touchStartX.current - touchEndX.current;
    const SWIPE_THRESHOLD = 50; // px required to trigger a swipe

    if (diff > SWIPE_THRESHOLD) {
      goNext();
    } else if (diff < -SWIPE_THRESHOLD) {
      goPrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const goTo = useCallback(
    (idx: number) => {
      setCurrentIndex(idx);
      setProgress(0);
      startTimeRef.current = Date.now();
    },
    []
  );

  const goNext = useCallback(
    () => goTo((currentIndex + 1) % images.length),
    [currentIndex, images.length, goTo]
  );

  const goPrev = useCallback(
    () => goTo((currentIndex - 1 + images.length) % images.length),
    [currentIndex, images.length, goTo]
  );

  useEffect(() => {
    if (images.length <= 1) return;

    const tick = () => {
      if (!paused) {
        const elapsed = Date.now() - startTimeRef.current;
        const p = Math.min(elapsed / AUTO_INTERVAL, 1);
        setProgress(p);
        if (p >= 1) {
          setCurrentIndex((prev) => (prev + 1) % images.length);
          setProgress(0);
          startTimeRef.current = Date.now();
        }
      } else {
        startTimeRef.current = Date.now() - progress * AUTO_INTERVAL;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [images.length, paused, progress]);

  return (
    <div
      className="w-full flex flex-col items-center gap-6 group"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Ambient glow behind phone */}
      <div className="relative flex items-center justify-center w-full">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(6,182,212,0.06) 0%, transparent 70%)",
          }}
        />

        {/* Phone + side nav buttons */}
        <div className="relative flex items-center gap-5 md:gap-8 py-8">
          <div className="opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-300">
            <NavButton direction="prev" onClick={goPrev} visible={images.length > 1} small />
          </div>

          <AnimatePresence mode="wait">
            <PhoneFrame
              key={currentIndex}
              src={images[currentIndex]}
              alt={`Screenshot ${currentIndex + 1}`}
              index={currentIndex}
            />
          </AnimatePresence>

          <div className="opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-300">
            <NavButton direction="next" onClick={goNext} visible={images.length > 1} small />
          </div>
        </div>
      </div>

      {/* Progress dots */}
      <ProgressDots
        count={images.length}
        current={currentIndex}
        progress={progress}
        onSelect={goTo}
      />

      {/* Slide counter */}
      {images.length > 1 && (
        <p className="text-[10px] text-zinc-600 tracking-[0.18em] font-medium uppercase -mt-2">
          {currentIndex + 1} / {images.length}
        </p>
      )}
    </div>
  );
}

// ─── Embedded / Photo Frame Mode ──────────────────────────────────────────────
function EmbeddedCarousel({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const rafRef = useRef<number | null>(null);

  const goTo = useCallback(
    (idx: number) => {
      setCurrentIndex(idx);
      setProgress(0);
      startTimeRef.current = Date.now();
    },
    []
  );

  const goNext = useCallback(
    () => goTo((currentIndex + 1) % images.length),
    [currentIndex, images.length, goTo]
  );

  const goPrev = useCallback(
    () => goTo((currentIndex - 1 + images.length) % images.length),
    [currentIndex, images.length, goTo]
  );

  // Auto-advance via requestAnimationFrame for smooth progress
  useEffect(() => {
    if (images.length <= 1) return;

    const tick = () => {
      if (!paused) {
        const elapsed = Date.now() - startTimeRef.current;
        const p = Math.min(elapsed / AUTO_INTERVAL, 1);
        setProgress(p);
        if (p >= 1) {
          setCurrentIndex((prev) => (prev + 1) % images.length);
          setProgress(0);
          startTimeRef.current = Date.now();
        }
      } else {
        // Keep updating startTime so progress doesn't jump on resume
        startTimeRef.current = Date.now() - progress * AUTO_INTERVAL;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [images.length, paused, progress]);

  return (
    <div
      className="relative w-full group pt-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <PhotoFrameMockup className="max-w-4xl">
        <motion.div
          className="flex w-full h-full"
          animate={{ x: `-${currentIndex * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {images.map((img, idx) => (
            <div key={idx} className="w-full h-full flex-shrink-0 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={`Project image ${idx + 1}`}
                className="w-full h-full object-cover object-top"
                draggable={false}
              />
            </div>
          ))}
        </motion.div>
      </PhotoFrameMockup>

      {images.length > 1 && (
        <>
          {/* Prev button */}
          <div className="absolute inset-y-0 left-0 md:-left-4 flex items-center px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <NavButton direction="prev" onClick={goPrev} />
          </div>
          {/* Next button */}
          <div className="absolute inset-y-0 right-0 md:-right-4 flex items-center px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <NavButton direction="next" onClick={goNext} />
          </div>
          {/* Bottom indicators */}
          <div className="absolute -bottom-8 inset-x-0 flex justify-center z-10">
            <ProgressDots
              count={images.length}
              current={currentIndex}
              progress={progress}
              onSelect={goTo}
            />
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function ProjectCarousel({ images, imageType = "auto" }: ProjectCarouselProps) {
  if (!images || images.length === 0) return null;

  if (imageType === "phone") {
    return <PhoneCarousel images={images} />;
  }

  if (imageType === "embedded") {
    return <EmbeddedCarousel images={images} />;
  }

  return <DesktopCarousel images={images} />;
}
