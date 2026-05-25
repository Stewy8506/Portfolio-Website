"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import FadeIn from "../ui/FadeIn";
import Section from "../ui/Section";
import { ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { GitHubIcon } from "../ui/BrandIcons";
import { useSoundEffect } from "@/hooks/useSoundEffect";

export default function Projects() {
  const { playThocc } = useSoundEffect();
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(data);
      } catch (e) {
        console.error("Failed to fetch projects", e);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  const categories = ["All", ...new Set(projects.map((p: any) => p.category))];
  const filteredProjects = filter === "All" 
    ? projects 
    : projects.filter((p: any) => p.category === filter);

  if (loading) return <Section className="py-32 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500" /></Section>;

  return (
    <Section id="projects" className="py-32">
      <FadeIn className="mb-16 text-center">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-5">
          Featured <span className="text-zinc-500">Works</span>
        </h2>
        <p className="text-muted text-lg max-w-2xl mx-auto text-balance mb-10">
          A selection of projects where I merge technical complexity with 
          minimalist design and high performance.
        </p>

        {/* Controls Row */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full max-w-5xl mx-auto">
          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onMouseEnter={playThocc}
                onClick={() => setFilter(cat)}
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border",
                  filter === cat 
                    ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]" 
                    : "bg-white/5 text-muted border-white/10 hover:border-white/30 hover:text-white"
                )}
                data-cursor="button"
              >
                {cat as string}
              </button>
            ))}
          </div>
        </div>
      </FadeIn>

      <motion.div 
        layout
        className="max-w-5xl mx-auto grid gap-8 grid-cols-1"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project: any, idx: number) => (
            <motion.div
              key={project.id || project.title}
              layout
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <ProjectListCard project={project} idx={idx} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </Section>
  );
}

// Alternating Full-Width Case Studies
function ProjectListCard({ project, idx }: { project: any; idx: number }) {
  const { playThocc } = useSoundEffect();
  const isEven = idx % 2 === 0;
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const images = project.images && project.images.length > 0 ? project.images : (project.image ? [project.image] : ["/projects/default.jpg"]);

  useEffect(() => {
    if (!isHovered || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIdx((prev) => (prev + 1) % images.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isHovered, images.length]);
  
  return (
    <motion.a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => {
        setIsHovered(true);
        playThocc();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIdx(0);
      }}
      className={cn(
        "relative flex flex-col w-full glass-effect rounded-3xl border border-white/[0.04] bg-white/[0.01] group overflow-hidden transition-all duration-500 hover:border-white/[0.12] hover:bg-white/[0.03] hover:shadow-[0_0_40px_rgba(255,255,255,0.02)]",
        isEven ? "md:flex-row" : "md:flex-row-reverse"
      )}
      data-cursor="scale"
    >
      {/* Image Half */}
      <div className="relative h-64 md:h-auto md:w-1/2 overflow-hidden bg-zinc-950 shrink-0">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={currentImageIdx}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: isHovered ? 1.05 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={images[currentImageIdx]}
              alt={`${project.title} - ${currentImageIdx + 1}`}
              fill
              unoptimized={images[currentImageIdx].startsWith('http')}
              className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {images.map((_: string, i: number) => (
              <button
                key={i}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentImageIdx(i);
                }}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-300",
                  i === currentImageIdx ? "bg-white w-3" : "bg-white/40 hover:bg-white/80"
                )}
              />
            ))}
          </div>
        )}

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/40 to-transparent pointer-events-none z-10" />
      </div>

      {/* Content Half */}
      <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center relative z-10">
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-emerald-400">
            {project.category}
          </span>
          <div className="flex gap-4">
            <GitHubIcon className="w-5 h-5 text-muted group-hover:text-white transition-colors" />
            <ExternalLink className="w-5 h-5 text-muted group-hover:text-white transition-colors" />
          </div>
        </div>

        <h3 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight group-hover:text-white transition-colors">
          {project.title}
        </h3>
        
        <p className="text-base text-muted leading-relaxed mb-8">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.tech.map((t: string) => (
            <span key={t} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-white/[0.03] text-zinc-400 border border-white/[0.05]">
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.a>
  );
}
