"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

interface Project {
  id?: string;
  title: string;
  description?: string;
  category?: string;
  image?: string;
  images?: string[];
  isCurrentlyWorkingOn?: boolean;
}

interface ProjectsCinematicProps {
  projects: Project[];
  onSelect: (project: Project) => void;
}

function CinematicCard({
  project,
  i,
  onSelect,
}: {
  project: Project;
  i: number;
  onSelect: (p: Project) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const thumbnail =
    Array.isArray(project.images) && project.images.length > 0
      ? project.images[0]
      : project.image || "/projects/default.jpg";
  const isRemote = typeof thumbnail === "string" && thumbnail.startsWith("http");

  // Parallax: background drifts slower than scroll, foreground faster
  const bgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const fgY = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["15px", "-15px"]);

  return (
    <div
      ref={cardRef}
      onClick={() => onSelect(project)}
      data-cursor="view"
      className="relative w-full h-[85vh] lg:h-[80vh] group cursor-none overflow-hidden border-b border-white/[0.04]"
    >
      {/* Parallax blurred background */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-[-10%] w-[120%] h-[120%] pointer-events-none"
      >
        <Image
          src={thumbnail}
          alt={project.title}
          fill
          sizes="100vw"
          unoptimized={isRemote}
          className="object-cover opacity-[0.18] blur-3xl scale-110 group-hover:opacity-[0.35] transition-opacity duration-1000"
        />
      </motion.div>

      {/* Overlay Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none z-[1]" />
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-1000 pointer-events-none z-[1]" />

      {/* Content & Foreground */}
      <div className="absolute inset-0 flex items-center p-8 md:p-16 lg:px-24 w-full max-w-7xl mx-auto z-[2]">
        <motion.div
          style={{ y: contentY }}
          className="w-full h-full flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-16"
        >
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}
            className="flex-1 w-full max-w-xl flex flex-col justify-end pb-4 md:pb-0"
          >
            <div className="flex items-center gap-4 mb-5">
              <span className="text-emerald-400 font-mono text-sm tracking-widest">
                {(i + 1).toString().padStart(2, "0")}
              </span>
              <span className="h-[1px] w-12 bg-white/20" />
              <span className="text-xs font-semibold tracking-widest uppercase text-white/50">
                {project.category}
              </span>
              {project.isCurrentlyWorkingOn && (
                <>
                  <span className="h-[1px] w-4 bg-white/20" />
                  <span className="relative flex h-2 w-2" title="Currently Working On">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                  </span>
                </>
              )}
            </div>

            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white mb-6 leading-none">
              {project.title}
            </h2>

            <p className="text-base md:text-lg text-zinc-400 max-w-lg line-clamp-3 leading-relaxed">
              {project.description}
            </p>

            <div className="mt-8 overflow-hidden h-auto md:h-0 group-hover:h-auto opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-500">
              <div className="inline-flex px-8 py-3.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white uppercase tracking-widest text-xs font-semibold hover:bg-white hover:text-black transition-colors">
                View Case Study
              </div>
            </div>
          </motion.div>

          {/* Right: Parallax foreground image */}
          <motion.div
            style={{ y: fgY }}
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 w-full h-[40%] md:h-[70%] min-h-[30vh] relative group-hover:scale-[1.03] transition-transform duration-1000 ease-out flex items-center justify-center"
          >
            <div className="relative w-full h-full">
              <Image
                src={thumbnail}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized={isRemote}
                className="object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function ProjectsCinematic({ projects, onSelect }: ProjectsCinematicProps) {
  return (
    <div className="w-full flex flex-col">
      {projects.map((project, i) => (
        <CinematicCard key={project.id || project.title} project={project} i={i} onSelect={onSelect} />
      ))}
    </div>
  );
}
