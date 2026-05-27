import React from "react";
import { notFound } from "next/navigation";
import FadeIn from "@/components/ui/FadeIn";
import { ArrowLeft, ExternalLink, Tag, Calendar, Network, Database } from "lucide-react";
import { GitHubIcon } from "@/components/ui/BrandIcons";
import Link from "next/link";
import { Project } from "@/lib/projects";
import MermaidDiagram from "@/components/ui/MermaidDiagram";
import ProjectCarousel from "@/components/ui/ProjectCarousel";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import fs from "fs/promises";
import path from "path";

const LOCAL_DATA_PATH = path.join(process.cwd(), "src/data/projects.json");

export const revalidate = 0;

async function getLocalProjects() {
  try {
    const data = await fs.readFile(LOCAL_DATA_PATH, "utf8");
    const parsed = JSON.parse(data);
    return parsed.map((p: any, idx: number) => ({
      id: p.id || p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || `project-${idx}`,
      ...p
    }));
  } catch (error) {
    return [];
  }
}

async function getAllProjects(): Promise<Project[]> {
  if (!isFirebaseConfigured || !db) {
    const localData = await getLocalProjects();
    localData.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    return localData;
  }

  try {
    const querySnapshot = await getDocs(collection(db, "projects"));
    const projects: any[] = [];
    
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      projects.push({
        id: docSnap.id,
        ...data,
        images: data.images || (data.image ? [data.image] : ["/projects/default.jpg"])
      });
    });

    if (projects.length === 0) {
      const localData = await getLocalProjects();
      localData.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
      return localData;
    }

    projects.sort((a, b) => (a.order || 0) - (b.order || 0));
    return projects;
  } catch (error) {
    console.error("Firestore Projects Fetch Error:", error);
    const localData = await getLocalProjects();
    return localData;
  }
}

// Generate static params for all projects at build time
export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p: Project) => ({
    slug: p.id || p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  }));
}

export default async function ProjectCaseStudy(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const projects = await getAllProjects();
  const project = projects.find((p: Project) => (p.id || p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")) === params.slug);

  if (!project) {
    notFound();
  }

  const images = project.images || (project.image ? [project.image] : ["/projects/default.jpg"]);

  // Resolve imageType: explicit field takes priority, otherwise infer from category
  const resolvedImageType: "phone" | "desktop" | "embedded" | "auto" =
    project.imageType ??
    (project.category?.toLowerCase().includes("mobile") ? "phone" : 
     project.category?.toLowerCase().includes("embedded") ? "embedded" : "auto");

  // Two-column layout specifically optimized for Phone/Mobile mockups to make usage of horizontal space
  if (resolvedImageType === "phone") {
    return (
      <div className="min-h-screen pt-32 pb-24 px-6 sm:px-8 max-w-5xl mx-auto">
        <FadeIn>
          {/* Back link */}
          <Link href="/#projects" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-10 text-sm font-medium group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Projects
          </Link>
        </FadeIn>

        {/* Desktop two-column / Mobile single-column stacked layout */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 pb-20">
          {/* Left Column: Title, description, CTAs, mobile-carousel, overview, metadata, and tech stack */}
          <div className="flex-1 min-w-0">
            <FadeIn>
              {/* Hero header */}
              <div className="mb-10">
                {project.category && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.18em] uppercase text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1 rounded-full mb-5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {project.category}
                  </span>
                )}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-5 text-white leading-[0.95]">
                  {project.title}
                </h1>
                <p className="text-lg text-zinc-400 leading-relaxed max-w-2xl">
                  {project.description}
                </p>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-wrap items-center gap-3 mb-12">
                {project.link && (
                  <a href={project.link} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-black font-semibold rounded-xl hover:bg-emerald-400 transition-colors text-sm">
                    <ExternalLink className="w-4 h-4" /> Live Demo
                  </a>
                )}
                {project.sourceCodeUrl && (
                  <a href={project.sourceCodeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors text-sm">
                    <GitHubIcon className="w-4 h-4" /> Source Code
                  </a>
                )}
              </div>
            </FadeIn>

            {/* Mobile-only Phone Carousel (shows in-line under title/CTAs on smaller screens) */}
            <FadeIn delay={0.15} className="block lg:hidden mb-12">
              <ProjectCarousel
                images={images}
                imageType={resolvedImageType}
              />
            </FadeIn>

            {/* Overview & Metadata */}
            <FadeIn delay={0.25}>
              {/* Section label */}
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6 block">
                Overview
              </span>

              {/* Overview text block with left accent */}
              <div className="relative pl-5 mb-8 border-l-2 border-emerald-500/40">
                <p className="text-xl text-zinc-200 leading-[1.8] font-light">
                  {project.overview || project.description || "A deep dive into the architecture, challenges, and solutions built for this project."}
                </p>
              </div>

              {/* Problem callout — only if data exists */}
              {project.problem && (
                <div className="mb-6 rounded-2xl border border-rose-500/15 bg-rose-500/[0.04] px-6 py-5">
                  <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-2">The Problem</p>
                  <p className="text-zinc-300 leading-relaxed text-sm">{project.problem}</p>
                </div>
              )}

              {/* Solution callout — only if data exists */}
              {project.solution && (
                <div className="mb-6 rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.04] px-6 py-5">
                  <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2">The Solution</p>
                  <p className="text-zinc-300 leading-relaxed text-sm">{project.solution}</p>
                </div>
              )}

              {/* The Approach callout — only if data exists */}
              {project.approach && (
                <div className="mb-6 rounded-2xl border border-cyan-500/15 bg-cyan-500/[0.04] px-6 py-5">
                  <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2">The Approach</p>
                  <p className="text-zinc-300 leading-relaxed text-sm">{project.approach}</p>
                </div>
              )}

              {/* Learnings callout — only if data exists */}
              {project.learnings && (
                <div className="mb-8 rounded-2xl border border-amber-500/15 bg-amber-500/[0.04] px-6 py-5">
                  <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-2">Key Learnings</p>
                  <p className="text-zinc-300 leading-relaxed text-sm">{project.learnings}</p>
                </div>
              )}

              {/* Metadata chips row */}
              <div className="flex flex-wrap items-center gap-3 mb-10">
                {project.date && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.07] text-sm text-zinc-300">
                    <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                    {project.date}
                  </div>
                )}
              </div>

              {project.isCurrentlyWorkingOn && (
                <div className="mb-10 px-5 py-3.5 rounded-2xl border border-amber-500/10 bg-amber-500/[0.02] text-xs text-amber-400/70 leading-relaxed max-w-2xl flex items-start gap-3">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-amber-400/80 mt-1.5 flex-shrink-0" />
                  <span>
                    <strong>Development Notice:</strong> This project is actively in progress. Content, features, and system architecture are currently under development and subject to change.
                  </span>
                </div>
              )}

              {/* Tech stack */}
              {project.tech && project.tech.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3">
                    Tech Stack
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech: string) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-full text-sm font-medium text-zinc-300 hover:bg-white/[0.08] hover:text-white transition-colors cursor-default shadow-sm backdrop-blur-md"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </FadeIn>
          </div>

          {/* Desktop-only Phone Carousel (sticky column on the right side on desktop) */}
          <div className="hidden lg:block lg:w-[320px] xl:w-[340px] flex-shrink-0">
            <div className="lg:sticky lg:top-[188px]">
              <FadeIn delay={0.15}>
                <ProjectCarousel
                  images={images}
                  imageType={resolvedImageType}
                />
              </FadeIn>
            </div>
          </div>
        </div>

        {/* Dynamic Case Study Sections */}
        {(project.architectureDiagram || project.databaseSchema || project.stateManagement || (project.challenges && project.challenges.length > 0)) && (
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
                    <MermaidDiagram code={project.architectureDiagram} id={`${project.id || 'proj'}-arch`} />
                  </div>
                )}

                {project.databaseSchema && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2 text-zinc-300 font-semibold">
                      <Database className="w-4 h-4 text-cyan-400" />
                      Database Schema
                    </div>
                    <MermaidDiagram code={project.databaseSchema} id={`${project.id || 'proj'}-db`} />
                  </div>
                )}
              </FadeIn>
            )}

            {/* State Management */}
            {project.stateManagement && (
              <FadeIn className="space-y-6">
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-blue-400 w-fit">
                    Data Flow
                  </span>
                  <h2 className="text-3xl font-bold tracking-tight text-white">
                    State Management Strategy
                  </h2>
                </div>
                <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-sm leading-relaxed text-zinc-300 text-sm">
                  <p className="whitespace-pre-wrap">{project.stateManagement}</p>
                </div>
              </FadeIn>
            )}

            {/* Technical Challenges */}
            {project.challenges && project.challenges.length > 0 && (
              <FadeIn className="space-y-10">
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-red-400 w-fit">
                    Post-Mortem
                  </span>
                  <h2 className="text-3xl font-bold tracking-tight text-white">
                    Technical Challenges & Solutions
                  </h2>
                  <p className="text-zinc-500 max-w-2xl leading-relaxed text-sm">
                    Real engineering hurdles faced during development, and the techniques used to resolve them.
                  </p>
                </div>

                <div className="grid gap-5">
                  {project.challenges.map((challenge, idx) => (
                    <div
                      key={idx}
                      className="group rounded-3xl border border-white/[0.05] bg-white/[0.015] p-6 md:p-8 hover:border-white/[0.12] hover:bg-white/[0.03] transition-all duration-500 backdrop-blur-sm"
                    >
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/3 space-y-1.5">
                          <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                            Challenge {idx + 1}
                          </div>
                          <h3 className="text-base font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors leading-snug">
                            {challenge.title}
                          </h3>
                        </div>
                        <div className="md:w-2/3 space-y-4">
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest">Problem</span>
                            <p className="text-zinc-400 leading-relaxed text-sm">{challenge.description}</p>
                          </div>
                          <div className="space-y-1 pt-3 border-t border-white/[0.05]">
                            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Resolution</span>
                            <p className="text-zinc-400 leading-relaxed text-sm">{challenge.solution}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </FadeIn>
            )}
          </div>
        )}
      </div>
    );
  }

  // Fallback / Standard Stacked Layout (e.g. for widescreen Desktop & Auto category projects)
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 sm:px-8 max-w-4xl mx-auto">
      <FadeIn>
        {/* Back link */}
        <Link href="/#projects" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-10 text-sm font-medium group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Projects
        </Link>

        {/* Hero header */}
        <div className="mb-10">
          {project.category && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.18em] uppercase text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1 rounded-full mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {project.category}
            </span>
          )}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-5 text-white leading-[0.95]">
            {project.title}
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed max-w-2xl">
            {project.description}
          </p>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center gap-3 mb-16">
          {project.link && (
            <a href={project.link} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-black font-semibold rounded-xl hover:bg-emerald-400 transition-colors text-sm">
              <ExternalLink className="w-4 h-4" /> Live Demo
            </a>
          )}
          {project.sourceCodeUrl && (
            <a href={project.sourceCodeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors text-sm">
              <GitHubIcon className="w-4 h-4" /> Source Code
            </a>
          )}
        </div>
      </FadeIn>

      {/* Carousel */}
      <FadeIn delay={0.15} className="mb-20">
        <ProjectCarousel
          images={images}
          imageType={resolvedImageType}
        />
      </FadeIn>

      {/* Overview + Metadata */}
      <FadeIn delay={0.25} className="mb-20">
        {/* Section label */}
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6 block">
          Overview
        </span>

        {/* Overview text block with left accent */}
        <div className="relative pl-5 mb-8 border-l-2 border-emerald-500/40">
          <p className="text-xl text-zinc-200 leading-[1.8] font-light">
            {project.overview || project.description || "A deep dive into the architecture, challenges, and solutions built for this project."}
          </p>
        </div>

        {/* Problem callout — only if data exists */}
        {project.problem && (
          <div className="mb-6 rounded-2xl border border-rose-500/15 bg-rose-500/[0.04] px-6 py-5">
            <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-2">The Problem</p>
            <p className="text-zinc-300 leading-relaxed text-sm">{project.problem}</p>
          </div>
        )}

        {/* Solution callout — only if data exists */}
        {project.solution && (
          <div className="mb-6 rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.04] px-6 py-5">
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2">The Solution</p>
            <p className="text-zinc-300 leading-relaxed text-sm">{project.solution}</p>
          </div>
        )}

        {/* The Approach callout — only if data exists */}
        {project.approach && (
          <div className="mb-6 rounded-2xl border border-cyan-500/15 bg-cyan-500/[0.04] px-6 py-5">
            <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2">The Approach</p>
            <p className="text-zinc-300 leading-relaxed text-sm">{project.approach}</p>
          </div>
        )}

        {/* Learnings callout — only if data exists */}
        {project.learnings && (
          <div className="mb-8 rounded-2xl border border-amber-500/15 bg-amber-500/[0.04] px-6 py-5">
            <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-2">Key Learnings</p>
            <p className="text-zinc-300 leading-relaxed text-sm">{project.learnings}</p>
          </div>
        )}

        {/* Metadata chips row */}
        <div className="flex flex-wrap items-center gap-3 mb-10">
          {project.date && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.07] text-sm text-zinc-300">
              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
              {project.date}
            </div>
          )}
        </div>

        {project.isCurrentlyWorkingOn && (
          <div className="mb-10 px-5 py-3.5 rounded-2xl border border-amber-500/10 bg-amber-500/[0.02] text-xs text-amber-400/70 leading-relaxed max-w-2xl flex items-start gap-3">
            <span className="flex h-1.5 w-1.5 rounded-full bg-amber-400/80 mt-1.5 flex-shrink-0" />
            <span>
              <strong>Development Notice:</strong> This project is actively in progress. Content, features, and system architecture are currently under development and subject to change.
            </span>
          </div>
        )}

        {/* Tech stack */}
        {project.tech && project.tech.length > 0 && (
          <div>
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3">
              Tech Stack
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech: string) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-full text-sm font-medium text-zinc-300 hover:bg-white/[0.08] hover:text-white transition-colors cursor-default shadow-sm backdrop-blur-md"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </FadeIn>

      {/* Dynamic Case Study Sections */}
      {(project.architectureDiagram || project.databaseSchema || project.stateManagement || (project.challenges && project.challenges.length > 0)) && (
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
                  <MermaidDiagram code={project.architectureDiagram} id={`${project.id || 'proj'}-arch`} />
                </div>
              )}

              {project.databaseSchema && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 text-zinc-300 font-semibold">
                    <Database className="w-4 h-4 text-cyan-400" />
                    Database Schema
                  </div>
                  <MermaidDiagram code={project.databaseSchema} id={`${project.id || 'proj'}-db`} />
                </div>
              )}
            </FadeIn>
          )}

          {/* State Management */}
          {project.stateManagement && (
            <FadeIn className="space-y-6">
              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-blue-400 w-fit">
                  Data Flow
                </span>
                <h2 className="text-3xl font-bold tracking-tight text-white">
                  State Management Strategy
                </h2>
              </div>
              <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-sm leading-relaxed text-zinc-300 text-sm">
                <p className="whitespace-pre-wrap">{project.stateManagement}</p>
              </div>
            </FadeIn>
          )}

          {/* Technical Challenges */}
          {project.challenges && project.challenges.length > 0 && (
            <FadeIn className="space-y-10">
              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-red-400 w-fit">
                  Post-Mortem
                </span>
                <h2 className="text-3xl font-bold tracking-tight text-white">
                  Technical Challenges & Solutions
                </h2>
                <p className="text-zinc-500 max-w-2xl leading-relaxed text-sm">
                  Real engineering hurdles faced during development, and the techniques used to resolve them.
                </p>
              </div>

              <div className="grid gap-5">
                {project.challenges.map((challenge, idx) => (
                  <div
                    key={idx}
                    className="group rounded-3xl border border-white/[0.05] bg-white/[0.015] p-6 md:p-8 hover:border-white/[0.12] hover:bg-white/[0.03] transition-all duration-500 backdrop-blur-sm"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3 space-y-1.5">
                        <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                          Challenge {idx + 1}
                        </div>
                        <h3 className="text-base font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors leading-snug">
                          {challenge.title}
                        </h3>
                      </div>
                      <div className="md:w-2/3 space-y-4">
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest">Problem</span>
                          <p className="text-zinc-400 leading-relaxed text-sm">{challenge.description}</p>
                        </div>
                        <div className="space-y-1 pt-3 border-t border-white/[0.05]">
                          <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Resolution</span>
                          <p className="text-zinc-400 leading-relaxed text-sm">{challenge.solution}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          )}
        </div>
      )}
    </div>
  );
}
