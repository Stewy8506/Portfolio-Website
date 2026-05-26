import React from "react";
import { notFound } from "next/navigation";
import FadeIn from "@/components/ui/FadeIn";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { GitHubIcon } from "@/components/ui/BrandIcons";
import Link from "next/link";
import { Project } from "@/lib/projects";
import MermaidDiagram from "@/components/ui/MermaidDiagram";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import fs from "fs/promises";
import path from "path";

const LOCAL_DATA_PATH = path.join(process.cwd(), "src/data/projects.json");

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

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 sm:px-8 max-w-4xl mx-auto">
      <FadeIn>
        <Link href="/#projects" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 text-white">
          {project.title}
        </h1>
        
        <p className="text-xl text-zinc-300 mb-10 leading-relaxed">
          {project.description}
        </p>

        <div className="flex flex-wrap items-center gap-4 mb-16">
          {project.link && (
            <a href={project.link} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black font-medium rounded-lg hover:bg-emerald-400 transition-colors">
              <ExternalLink className="w-4 h-4" /> Live Demo
            </a>
          )}
          {project.sourceCodeUrl && (
            <a href={project.sourceCodeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white font-medium rounded-lg hover:bg-white/10 transition-colors">
              <GitHubIcon className="w-4 h-4" /> Source Code
            </a>
          )}
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="aspect-video w-full rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 mb-16 relative">
          <img src={project.image || "/projects/default.jpg"} alt={project.title} className="w-full h-full object-cover" />
        </div>
      </FadeIn>

      <div className="grid md:grid-cols-3 gap-12">
        <FadeIn delay={0.3} className="md:col-span-2 prose prose-invert max-w-none prose-emerald">
          <h2>Overview</h2>
          <p>
            {project.overview || project.description || "A deep dive into the architecture, challenges, and solutions built for this project."}
          </p>
          
          <h3>Architecture & Tech Stack</h3>
          <p>This project was built using modern tools to ensure scalability and maintainability.</p>
          <ul>
            {project.tech?.map((tech: string) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
        </FadeIn>

        <FadeIn delay={0.4} className="space-y-8">
          <div>
            <h4 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Category</h4>
            <p className="text-zinc-300">{project.category || "General"}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Timeline</h4>
            <p className="text-zinc-300">2023 - Present</p>
          </div>
        </FadeIn>
      </div>

      {/* Dynamic Case Study Section */}
      {(project.architectureDiagram || project.databaseSchema || project.stateManagement || (project.challenges && project.challenges.length > 0)) && (
        <div className="mt-20 pt-16 border-t border-white/[0.08] space-y-20">
          
          {/* Architecture Section */}
          {(project.architectureDiagram || project.databaseSchema) && (
            <FadeIn className="space-y-12">
              <div className="space-y-4 flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-emerald-400 w-fit">
                  Technical Architecture
                </span>
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  System Architecture & Design
                </h2>
                <p className="text-zinc-400 max-w-2xl leading-relaxed text-sm">
                  A high-level blueprint displaying the design decisions, communication pathways, and structural data relationships underlying this project.
                </p>
              </div>

              {project.architectureDiagram && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-zinc-200">Core Architecture Flow</h3>
                  <MermaidDiagram code={project.architectureDiagram} id={`${project.id || 'proj'}-arch`} />
                </div>
              )}

              {project.databaseSchema && (
                <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-semibold text-zinc-200">Database Schema</h3>
                  <MermaidDiagram code={project.databaseSchema} id={`${project.id || 'proj'}-db`} />
                </div>
              )}
            </FadeIn>
          )}

          {/* State Management Section */}
          {project.stateManagement && (
            <FadeIn className="space-y-6">
              <div className="space-y-4 flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-blue-400 w-fit">
                  Data Flow
                </span>
                <h2 className="text-3xl font-bold tracking-tight text-white">
                  State Management Strategy
                </h2>
              </div>
              <div className="glass-effect rounded-3xl border border-white/[0.04] bg-white/[0.01] p-8 backdrop-blur-sm leading-relaxed text-zinc-300 space-y-4 max-w-none text-sm">
                <p className="whitespace-pre-wrap">{project.stateManagement}</p>
              </div>
            </FadeIn>
          )}

          {/* Technical Challenges Section */}
          {project.challenges && project.challenges.length > 0 && (
            <FadeIn className="space-y-10">
              <div className="space-y-4 flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-red-400 w-fit">
                  Post-Mortem
                </span>
                <h2 className="text-3xl font-bold tracking-tight text-white">
                  Technical Challenges & Solutions
                </h2>
                <p className="text-zinc-400 max-w-2xl leading-relaxed text-sm">
                  Real engineering hurdles faced during development, and the precise techniques utilized to resolve them.
                </p>
              </div>

              <div className="grid gap-6">
                {project.challenges.map((challenge, idx) => (
                  <div 
                    key={idx}
                    className="group glass-effect rounded-3xl border border-white/[0.04] bg-white/[0.01] p-6 md:p-8 hover:border-white/[0.12] hover:bg-white/[0.03] transition-all duration-500 backdrop-blur-sm"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3 space-y-2">
                        <div className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                          Challenge {idx + 1}
                        </div>
                        <h3 className="text-lg font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">
                          {challenge.title}
                        </h3>
                      </div>
                      
                      <div className="md:w-2/3 space-y-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Problem</span>
                          <p className="text-zinc-300 leading-relaxed text-sm">
                            {challenge.description}
                          </p>
                        </div>
                        <div className="space-y-1 pt-2 border-t border-white/[0.06]">
                          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Resolution</span>
                          <p className="text-zinc-300 leading-relaxed text-sm">
                            {challenge.solution}
                          </p>
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
