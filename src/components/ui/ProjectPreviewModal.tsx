"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import Image from "next/image";
import { GitHubIcon } from "./BrandIcons";
import { getProjectLiveUrl, type Project } from "@/lib/projects";

interface ProjectPreviewModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectPreviewModal({ project, isOpen, onClose }: ProjectPreviewModalProps) {
  const images = project && Array.isArray(project.images) && project.images.length > 0
    ? project.images
    : (project?.image ? [project.image] : ["/projects/default.jpg"]);
  const liveUrl = project ? getProjectLiveUrl(project) : "";
  const scrollRef = useRef<HTMLDivElement>(null);

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Reset scroll position on open
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen, project]);

  if (!project) return null;

  // Stagger variants for content
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 md:p-6 lg:p-8">
          {/* Ambient Backdrop */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.5 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/80 cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.98, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full h-full max-w-[1600px] flex flex-col lg:flex-row bg-[#09090b] text-zinc-300 border border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)] overflow-y-auto lg:overflow-hidden rounded-[2rem] md:rounded-[3rem]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button - Floating absolute */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 lg:top-8 lg:right-8 z-50 p-4 rounded-full bg-black/50 hover:bg-white text-zinc-400 hover:text-black backdrop-blur-md border border-white/10 hover:border-transparent transition-all duration-300 group"
            >
              <X size={24} strokeWidth={1.5} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Left Column: Sticky Information */}
            <div className="w-full lg:w-[45%] xl:w-[40%] h-auto lg:h-full overflow-visible lg:overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden border-b lg:border-b-0 lg:border-r border-white/5 bg-zinc-950/50 relative z-10 shrink-0">
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="p-8 md:p-12 lg:p-16 xl:p-20 flex flex-col min-h-full"
              >
                {/* Meta */}
                <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 mb-8">
                  <span className="px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase text-emerald-400 bg-emerald-400/10 rounded-full border border-emerald-400/20">
                    {project.category || "WEB"}
                  </span>
                  {project.date && (
                    <span className="text-sm font-medium text-zinc-500 tracking-widest uppercase">
                      {project.date}
                    </span>
                  )}
                  {project.isCurrentlyWorkingOn && (
                    <span className="flex items-center gap-2 px-3 py-1 text-xs font-semibold tracking-wider uppercase text-amber-400 bg-amber-400/10 rounded-full border border-amber-400/20">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                      </span>
                      Currently Working On
                    </span>
                  )}
                </motion.div>

                {/* Title & Desc */}
                <motion.div variants={itemVariants} className="mb-12">
                  <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white mb-6 leading-[0.9]">
                    {project.title}
                  </h2>
                  <p className="text-xl md:text-2xl text-zinc-400 leading-relaxed font-light">
                    {project.description}
                  </p>
                </motion.div>

                {/* Extended Details */}
                <div className="space-y-10 mb-16 flex-grow">
                  {project.overview && (
                    <motion.div variants={itemVariants}>
                      <h4 className="text-sm font-semibold tracking-widest text-zinc-500 uppercase mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" /> Overview
                      </h4>
                      <p className="text-base text-zinc-300 leading-loose">
                        {project.overview}
                      </p>
                    </motion.div>
                  )}

                  {project.problem && (
                    <motion.div variants={itemVariants}>
                      <h4 className="text-sm font-semibold tracking-widest text-zinc-500 uppercase mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-rose-500" /> The Problem
                      </h4>
                      <p className="text-base text-zinc-300 leading-loose">
                        {project.problem}
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Tech Stack & Links */}
                <motion.div variants={itemVariants} className="mt-auto space-y-12">
                  {/* Tech Stack */}
                  <div>
                    <h4 className="text-xs font-semibold tracking-widest text-zinc-600 uppercase mb-4 border-b border-white/10 pb-4">
                      Technologies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.tech?.map((t: string) => (
                        <span
                          key={t}
                          className="px-4 py-2 text-xs font-medium text-zinc-300 bg-white/[0.02] border border-white/5 rounded-lg hover:bg-white/10 hover:border-white/20 transition-colors cursor-default"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    {liveUrl && (
                      <a
                        href={liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex-1 overflow-hidden rounded-xl bg-white text-black font-bold text-sm h-14 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          View Live Site <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-zinc-200 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                      </a>
                    )}
                    {project.sourceCodeUrl && (
                      <a
                        href={project.sourceCodeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex-1 flex items-center justify-center gap-2 h-14 rounded-xl bg-transparent border border-white/20 text-white font-bold text-sm hover:bg-white/5 transition-colors"
                      >
                        Source Code <GitHubIcon className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Right Column: Scrollable Image Feed */}
            <div 
              ref={scrollRef}
              className="flex-1 h-auto lg:h-full overflow-visible lg:overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden bg-zinc-950/20 relative"
            >
              <div className="p-4 md:p-8 lg:p-12 space-y-8 md:space-y-12 lg:space-y-16">
                {images.map((img: string, idx: number) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative w-full rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 shadow-2xl group"
                  >
                    {/* Maintain aspect ratio natively by rendering next/image without 'fill' if we want natural height, 
                        or we can use a huge aspect ratio container. Let's use a dynamic aspect ratio wrapper. */}
                    <Image
                      src={img}
                      alt={`${project.title} screenshot ${idx + 1}`}
                      width={1600}
                      height={1200}
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-1000 ease-out"
                      unoptimized={img.startsWith('http')}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
