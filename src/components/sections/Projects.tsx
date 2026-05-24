"use client";

import React, { useState, useEffect } from "react";
import FadeIn from "../ui/FadeIn";
import Section from "../ui/Section";
import { ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { GitHubIcon } from "../ui/BrandIcons";

export default function Projects() {
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

  if (loading) return <Section className="py-32 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white" /></Section>;

  return (
    <Section id="projects" className="py-32">
      <FadeIn className="mb-16 text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
          Featured <span className="text-zinc-500">Works</span>
        </h2>
        <p className="text-muted text-lg max-w-2xl mx-auto text-balance mb-10">
          A selection of projects where I merge technical complexity with 
          minimalist design and high performance.
        </p>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border",
                filter === cat 
                  ? "bg-white text-black border-white" 
                  : "bg-white/5 text-muted border-white/10 hover:border-white/30 hover:text-white"
              )}
              data-cursor="button"
            >
              {cat}
            </button>
          ))}
        </div>
      </FadeIn>

      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project: any, idx: number) => (
            <motion.div
              key={project.id || project.title}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <motion.a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5 }}
                data-cursor="scale"
                className={cn(
                  "relative block glass-effect p-8 rounded-3xl border border-white/10 group overflow-hidden transition-all hover:border-white/20 h-full",
                )}
              >
                {/* Project Image */}
                <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-muted">
                      {project.category}
                    </span>
                    <div className="flex gap-3">
                      <GitHubIcon className="w-5 h-5 text-muted group-hover:text-white transition-colors" />
                      <ExternalLink className="w-5 h-5 text-muted group-hover:text-white transition-colors" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-3 group-hover:text-white transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-muted leading-relaxed mb-6 group-hover:text-zinc-400 transition-colors">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t: string) => (
                      <span key={t} className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded bg-zinc-900 text-zinc-500 border border-zinc-800">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.a>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </Section>
  );
}
