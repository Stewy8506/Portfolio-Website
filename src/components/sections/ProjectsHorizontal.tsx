"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import Image from "next/image";

// Extracted so useTransform is called at the top level of a component, not inside a .map()
function DotIndicator({
  idx,
  total,
  scrollYProgress,
}: {
  idx: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  // Guard for single-project case: keep offsets strictly [0, 0, 1, 1]
  const seg = total > 1 ? 1 / total : 1;
  const rawStart = idx * seg;
  const rawEnd = (idx + 1) * seg;

  // Ensure strict monotonic ordering clamped to [0, 1]
  const start  = Math.min(1, Math.max(0, rawStart));
  const midIn  = Math.min(1, Math.max(start,  rawStart + seg * 0.15));
  const midOut = Math.min(1, Math.max(midIn,  rawEnd   - seg * 0.15));
  const end    = Math.min(1, Math.max(midOut, rawEnd));

  const opacity = useTransform(scrollYProgress, [start, midIn, midOut, end], [0.3, 1, 1, 0.3]);

  return (
    <motion.div
      style={{ opacity }}
      className="w-1.5 h-1.5 rounded-full bg-white"
    />
  );
}

interface Project {
  id?: string;
  title: string;
  category?: string;
  image?: string;
  images?: string[];
  isCurrentlyWorkingOn?: boolean;
}

interface ProjectsHorizontalProps {
  projects: Project[];
  onSelect: (project: Project) => void;
}

export default function ProjectsHorizontal({ projects, onSelect }: ProjectsHorizontalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollRange, setScrollRange] = useState(0);

  useEffect(() => {
    const updateScrollRange = () => {
      if (trackRef.current) {
        setScrollRange(trackRef.current.scrollWidth - window.innerWidth);
      }
    };
    
    updateScrollRange();
    window.addEventListener("resize", updateScrollRange);
    return () => window.removeEventListener("resize", updateScrollRange);
  }, [projects]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const n = projects.length;

  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollRange]);

  // Progress bar width driven by scroll
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Scroll distance: each step = 58vw card + 6rem gap, give a little breathing room.
  const scrollHeight =
    n > 1 ? `calc(100vh + ${(n - 1) * 70}vw)` : "100vh";

  return (
    <div ref={containerRef} className="relative bg-zinc-950" style={{ height: scrollHeight }}>
      <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
        {/* Thin scroll progress bar at top */}
        <div className="w-full h-[2px] bg-white/5 relative shrink-0">
          <motion.div
            style={{ width: progressWidth }}
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-500/60 to-emerald-400"
          />
        </div>

        {/* Card strip */}
        <div className="flex-1 flex items-center overflow-hidden">
          <motion.div ref={trackRef} style={{ x }} className="flex gap-12 md:gap-24 px-[5vw] md:px-[8vw] w-max">
            {projects.map((project, i) => {
              const thumbnail =
                Array.isArray(project.images) && project.images.length > 0
                  ? project.images[0]
                  : project.image || "/projects/default.jpg";
              const isRemoteThumbnail =
                typeof thumbnail === "string" && thumbnail.startsWith("http");

              return (
                <div
                  key={project.id || project.title}
                  onClick={() => onSelect(project)}
                  className="group relative w-[82vw] md:w-[58vw] max-w-4xl aspect-video shrink-0 cursor-none"
                  data-cursor="view"
                >
                  {/* 3D hover card */}
                  <motion.div
                    whileHover={{ scale: 1.02, rotateY: -2, rotateX: 2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="relative w-full h-full rounded-2xl overflow-hidden border border-white/5 shadow-[0_30px_80px_rgba(0,0,0,0.8)] bg-zinc-900"
                    style={{ transformStyle: "preserve-3d", perspective: 1500 }}
                  >
                    <Image
                      src={thumbnail}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 82vw, 58vw"
                      unoptimized={isRemoteThumbnail}
                      className="object-cover opacity-50 group-hover:opacity-90 transition-opacity duration-700"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                    {/* Glassmorphic top strip (index + category) */}
                    <div className="absolute top-6 left-6 flex items-center gap-3">
                      <span className="text-emerald-400 font-mono text-xs tracking-widest bg-black/40 px-2 py-0.5 rounded backdrop-blur-md">
                        {(i + 1).toString().padStart(2, "0")}/{projects.length.toString().padStart(2, "0")}
                      </span>
                      <span className="h-3 w-[1px] bg-white/20" />
                      <span className="px-3 py-1 text-[10px] font-bold tracking-widest uppercase text-white bg-white/10 rounded-full backdrop-blur-xl border border-white/20 shadow-xl">
                        {project.category}
                      </span>
                      {project.isCurrentlyWorkingOn && (
                        <span className="relative flex h-2 w-2 ml-0.5" title="Currently Working On">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                        </span>
                      )}
                    </div>

                    {/* Bottom content — elevated in Z */}
                    <div
                      className="absolute bottom-0 left-0 p-8 md:p-10 w-full"
                      style={{ transform: "translateZ(30px)" }}
                    >
                      <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors duration-300 leading-tight">
                        {project.title}
                      </h3>
                      <p className="mt-2 text-xs uppercase tracking-widest text-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        Click to open ↗
                      </p>
                    </div>
                  </motion.div>
                </div>
              );
            })}

            {/* End spacer for last card breathing room */}
            <div className="w-[5vw] md:w-[8vw] shrink-0" />
          </motion.div>
        </div>

        {/* Bottom HUD */}
        <div className="absolute bottom-8 inset-x-0 flex items-center justify-between px-8 md:px-12 pointer-events-none shrink-0">
          <div className="flex flex-col items-start gap-1 opacity-40">
            <span className="text-[9px] uppercase tracking-widest font-semibold">Scroll Down</span>
            <div className="w-[1px] h-10 bg-gradient-to-b from-white to-transparent" />
          </div>
          <div className="flex items-center gap-2 opacity-30">
            <div className="flex gap-1.5">
              {projects.map((_, idx) => (
                <DotIndicator
                  key={idx}
                  idx={idx}
                  total={projects.length}
                  scrollYProgress={scrollYProgress}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
