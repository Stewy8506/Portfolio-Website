"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ExternalLink, Loader2 } from "lucide-react";
import Image from "next/image";
import { GitHubIcon } from "./BrandIcons";
import { getProjectLiveUrl, type Project } from "@/lib/projects";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LaptopMockup } from "./LaptopMockup";
import { PhotoFrameMockup } from "./PhotoFrameMockup";

// Inline phone frame for modal — mirrors ProjectCarousel phone design
function ModalPhoneFrame({ src, title, idx }: { src: string; title: string; idx: number }) {
  return (
    <motion.div
      key={idx}
      initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex justify-center py-4"
    >
      <div
        className="relative rounded-[2rem] overflow-hidden select-none"
        style={{
          width: "min(260px, 80vw)",
          background: "linear-gradient(145deg, #2a2a2e 0%, #1a1a1e 40%, #0f0f12 100%)",
          padding: "3px",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.08), 0 40px 100px -16px rgba(0,0,0,0.95), 0 0 60px -20px rgba(6,182,212,0.10), inset 0 1px 0 rgba(255,255,255,0.12)",
        }}
      >
        {/* Side buttons */}
        <div className="absolute -left-[3px] top-[88px] w-[3px] h-8 rounded-l-full" style={{ background: "linear-gradient(180deg, #3a3a3e, #252528)" }} />
        <div className="absolute -left-[3px] top-[132px] w-[3px] h-8 rounded-l-full" style={{ background: "linear-gradient(180deg, #3a3a3e, #252528)" }} />
        <div className="absolute -right-[3px] top-[108px] w-[3px] h-12 rounded-r-full" style={{ background: "linear-gradient(180deg, #3a3a3e, #252528)" }} />
        {/* Inner screen */}
        <div className="relative rounded-[1.9rem] overflow-hidden" style={{ background: "#000" }}>
          <div className="relative" style={{ aspectRatio: "9/19.5" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`${title} screenshot ${idx + 1}`} className="w-full h-full object-cover object-top" draggable={false} />
            <div className="absolute inset-0 pointer-events-none rounded-[1.9rem]" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%, rgba(0,0,0,0.15) 100%)" }} />
          </div>
        </div>
        <div className="absolute inset-0 rounded-[2rem] pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 40%)" }} />
      </div>
    </motion.div>
  );
}

// "Read Full Case Study" button with immediate loading feedback
function CaseStudyButton({ href, onClose }: { href: string; onClose: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    onClose();
    router.push(href);
  }

  return (
    <button
      onClick={handleClick}
      className="group relative w-full overflow-hidden rounded-xl bg-white text-black font-bold text-sm h-14 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-80 disabled:cursor-default"
      disabled={loading}
    >
      <span className="relative z-10 flex items-center gap-2">
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Opening…
          </>
        ) : (
          <>
            Read Full Case Study
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </span>
      {!loading && (
        <div className="absolute inset-0 bg-zinc-200 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
      )}
    </button>
  );
}

interface ProjectPreviewModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectPreviewModal({ project: incomingProject, isOpen, onClose }: ProjectPreviewModalProps) {
  const [mounted, setMounted] = useState(false);
  const [project, setProject] = useState<Project | null>(incomingProject);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (incomingProject) setProject(incomingProject);
  }, [incomingProject]);

  // Simple overflow hidden for scroll-lock (prevents jumping)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Reset modal scroll position on open
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!project || !mounted || typeof document === 'undefined') return null;

  const images = Array.isArray(project.images) && project.images.length > 0
    ? project.images
    : (project?.image ? [project.image] : ["/projects/default.jpg"]);
  const liveUrl = project ? getProjectLiveUrl(project) : "";

  // Same fallback as slug page — infer phone from category when field missing in Firestore
  const resolvedImageType: "phone" | "desktop" | "embedded" | "auto" =
    project.imageType ??
    (project.category?.toLowerCase().includes("mobile") ? "phone" : 
     project.category?.toLowerCase().includes("embedded") ? "embedded" : "auto");

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

  const modalContent = (
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
            <div className="w-full lg:w-1/2 h-auto lg:h-full overflow-visible lg:overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden border-b lg:border-b-0 lg:border-r border-white/5 bg-zinc-950/50 relative z-10 shrink-0">
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
                </motion.div>

                {project.isCurrentlyWorkingOn && (
                  <motion.div
                    variants={itemVariants}
                    className="mb-8 px-5 py-3.5 rounded-xl border border-amber-500/10 bg-amber-500/[0.02] text-xs text-amber-400/70 leading-relaxed flex items-start gap-3"
                  >
                    <span className="flex h-1.5 w-1.5 rounded-full bg-amber-400/80 mt-1.5 flex-shrink-0" />
                    <span>
                      <strong>Development Notice:</strong> This project is actively in progress. Content, features, and system architecture are currently under development and subject to change.
                    </span>
                  </motion.div>
                )}

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
                  <div className="flex flex-col gap-3 pt-4">
                    <CaseStudyButton
                      href={`/projects/${project.id || project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                      onClose={onClose}
                    />

                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                      {liveUrl && (
                        <a
                          href={liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-white/[0.04] border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all hover:scale-[1.01]"
                        >
                          Live Site <ExternalLink size={14} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                        </a>
                      )}
                      {project.sourceCodeUrl && (
                        <a
                          href={project.sourceCodeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-transparent border border-white/20 text-white font-bold text-xs hover:bg-white/5 transition-colors"
                        >
                          Source Code <GitHubIcon className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Right Column: Scrollable Image Feed */}
            <div
              ref={scrollRef}
              className="w-full lg:w-1/2 h-auto lg:h-full overflow-visible lg:overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden bg-zinc-950/20 relative"
            >
              <div className="p-4 md:p-8 lg:p-12 space-y-8 md:space-y-12 lg:space-y-16">
                {resolvedImageType === "phone" ? (
                  // Phone layout — stacked phone mockups
                  <div className="space-y-4">
                    {images.map((img: string, idx: number) => (
                      <ModalPhoneFrame key={idx} src={img} title={project.title} idx={idx} />
                    ))}
                  </div>
                ) : resolvedImageType === "embedded" ? (
                  // Embedded layout — photo frame mockups
                  <div className="space-y-12">
                    {images.map((img: string, idx: number) => (
                      <PhotoFrameMockup
                        key={idx}
                        src={img}
                        alt={`${project.title} screenshot ${idx + 1}`}
                        className="max-w-4xl pt-8"
                        initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                        whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    ))}
                  </div>
                ) : (
                  // Desktop / default layout — laptop mockups
                  <div className="space-y-12">
                    {images.map((img: string, idx: number) => (
                      <LaptopMockup
                        key={idx}
                        src={img}
                        alt={`${project.title} screenshot ${idx + 1}`}
                        className="max-w-4xl pt-8"
                        initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                        whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
