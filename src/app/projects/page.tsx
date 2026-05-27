/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element, react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, LayoutGrid, Rows, Maximize } from "lucide-react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import ProjectPreviewModal from "@/components/ui/ProjectPreviewModal";
import ProjectsCinematic from "../../components/sections/ProjectsCinematic";

export default function AllProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [filter, setFilter] = useState("All");

  // Smart Header Scroll Tracking
  const { scrollY } = useScroll();
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest < 50) {
      setHeaderVisible(true);
    } else if (latest > lastScrollY && latest > 150) {
      setHeaderVisible(false);
    } else if (latest < lastScrollY) {
      setHeaderVisible(true);
    }
    setLastScrollY(latest);
  });

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

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white/20 border-r-2 border-r-white/20 border-b-2 border-white" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white relative z-0 flex flex-col">
      {/* Smart Animated Header */}
      <motion.header 
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: "-100%", opacity: 0 }
        }}
        animate={headerVisible ? "visible" : "hidden"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 z-40 w-full bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 py-4 px-6 lg:px-12 flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-6">
          <Link 
            href="/#projects" 
            replace
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight uppercase hidden md:block">Selected Works</h1>
        </div>

        {/* Category Filters */}
        <div className="flex flex-1 justify-center overflow-x-auto no-scrollbar py-1">
          <div className="flex items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat as string}
                onClick={() => setFilter(cat as string)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border ${
                  filter === cat 
                    ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]" 
                    : "bg-white/5 text-zinc-400 border-white/10 hover:border-white/30 hover:text-white"
                }`}
              >
                {cat as string}
              </button>
            ))}
          </div>
        </div>
      </motion.header>
      
      {/* Dynamic Viewport */}
      <div className="flex-1 w-full relative pt-[150px] md:pt-[88px]">
        <ProjectsCinematic projects={filteredProjects} onSelect={setSelectedProject} />
      </div>

      <ProjectPreviewModal 
        project={selectedProject} 
        isOpen={!!selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </main>
  );
}
