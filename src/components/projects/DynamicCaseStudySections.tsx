"use client";

import React from "react";
import FadeIn from "@/components/ui/FadeIn";
import { Network, Database, Zap, CheckCircle2, Cpu } from "lucide-react";
import MermaidDiagram from "@/components/ui/MermaidDiagram";
import { Project } from "@/lib/projects";

export default function DynamicCaseStudySections({ project }: { project: Project }) {
  if (
    !project.architectureDiagram &&
    !project.databaseSchema &&
    !project.stateManagement &&
    (!project.challenges || project.challenges.length === 0)
  ) {
    return null;
  }

  return (
    <div className="pt-16 border-t border-white/[0.06] space-y-24">
      {/* Architecture & Database Schema */}
      {(project.architectureDiagram || project.databaseSchema) && (
        <FadeIn className="space-y-10">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-emerald-400 w-fit">
              Technical Architecture
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              System Architecture & Design
            </h2>
            <p className="text-zinc-500 max-w-2xl leading-relaxed text-sm">
              A high-level blueprint of design decisions, communication pathways, and structural data relationships.
            </p>
          </div>

          {project.architectureDiagram && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-zinc-300 font-semibold">
                <Network className="w-4 h-4 text-emerald-400" />
                Core Architecture Flow
              </div>
              <MermaidDiagram code={project.architectureDiagram} id={`${project.id || "proj"}-arch`} />
            </div>
          )}

          {project.databaseSchema && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-zinc-300 font-semibold">
                <Database className="w-4 h-4 text-cyan-400" />
                Database Schema
              </div>
              <MermaidDiagram code={project.databaseSchema} id={`${project.id || "proj"}-db`} />
            </div>
          )}
        </FadeIn>
      )}

      {/* State Management */}
      {project.stateManagement && (
        <FadeIn className="space-y-6 mt-32">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 w-fit flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5" />
              Data Flow
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              State Management Strategy
            </h2>
          </div>
          <div className="relative rounded-3xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent p-8 md:p-10 backdrop-blur-md overflow-hidden group">
            {/* Glowing orb background */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] group-hover:bg-blue-500/30 transition-colors duration-700 pointer-events-none" />
            
            <div className="relative z-10 leading-relaxed text-zinc-300 text-sm md:text-base whitespace-pre-wrap">
              {project.stateManagement}
            </div>
          </div>
        </FadeIn>
      )}

      {/* Technical Challenges */}
      {project.challenges && project.challenges.length > 0 && (
        <FadeIn className="space-y-10 mt-32">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 w-fit flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" />
              Post-Mortem
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Technical Challenges & Solutions
            </h2>
            <p className="text-zinc-400 max-w-2xl leading-relaxed text-sm md:text-base">
              Real engineering hurdles faced during development, and the techniques used to resolve them.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {project.challenges.map((challenge, idx) => (
              <div
                key={idx}
                className="group relative rounded-3xl border border-white/[0.05] bg-zinc-950/50 overflow-hidden hover:border-white/[0.12] transition-all duration-500"
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="relative p-6 md:p-8 flex flex-col h-full z-10">
                  <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] mb-5 text-zinc-400 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all duration-300">
                      <span className="font-mono text-sm font-bold">0{idx + 1}</span>
                    </div>
                    <h3 className="text-xl font-bold text-zinc-100 group-hover:text-white transition-colors leading-snug">
                      {challenge.title}
                    </h3>
                  </div>
                  
                  <div className="flex-1 space-y-6">
                    <div className="space-y-2">
                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-red-400 uppercase tracking-widest">
                        <Zap className="w-3 h-3" /> Problem
                      </span>
                      <p className="text-zinc-400 leading-relaxed text-sm">{challenge.description}</p>
                    </div>
                    
                    <div className="space-y-2 pt-5 border-t border-white/[0.05]">
                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                        <CheckCircle2 className="w-3 h-3" /> Resolution
                      </span>
                      <p className="text-zinc-300 leading-relaxed text-sm">{challenge.solution}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      )}
    </div>
  );
}
