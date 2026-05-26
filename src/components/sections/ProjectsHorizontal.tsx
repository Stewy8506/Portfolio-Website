"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

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
  
  // Use scroll progress to translate horizontal movement
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(projects.length - 1) * 60 + 20}%`]);

  return (
    <div ref={containerRef} className="relative h-[300vh] bg-zinc-950">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-16 md:gap-32 px-12 md:px-32 w-max">
          {projects.map((project, i) => {
            const thumbnail = Array.isArray(project.images) && project.images.length > 0
              ? project.images[0]
              : project.image || "/projects/default.jpg";
            const isRemoteThumbnail = typeof thumbnail === "string" && thumbnail.startsWith("http");

            return (
              <div 
                key={project.id || project.title}
                onClick={() => onSelect(project)}
                className="group relative w-[80vw] md:w-[60vw] max-w-4xl aspect-video shrink-0 cursor-none"
                data-cursor="view"
              >
                {/* Image Container with 3D hover effect */}
                <motion.div 
                  whileHover={{ scale: 1.05, rotateY: -5, rotateX: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-900"
                  style={{ transformStyle: "preserve-3d", perspective: 1000 }}
                >
                  <Image
                    src={thumbnail}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 80vw, 60vw"
                    unoptimized={isRemoteThumbnail}
                    className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Content translated in Z space */}
                  <div 
                    className="absolute bottom-0 left-0 p-8 md:p-12 w-full translate-z-12"
                    style={{ transform: "translateZ(50px)" }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-emerald-400 font-mono text-sm tracking-widest">
                        {(i + 1).toString().padStart(2, "0")}
                      </span>
                      <span className="px-3 py-1 text-[10px] font-bold tracking-widest uppercase text-white bg-white/10 rounded-full backdrop-blur-md">
                        {project.category}
                      </span>
                      {project.isCurrentlyWorkingOn && (
                        <span className="relative flex h-2 w-2 ml-1" title="Currently Working On">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-2 group-hover:text-emerald-400 transition-colors">
                      {project.title}
                    </h3>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
        
        {/* Scroll Instruction */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 pointer-events-none">
          <span className="text-[10px] uppercase tracking-widest font-semibold">Scroll Down</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
        </div>
      </div>
    </div>
  );
}
