"use client";

import FadeIn from "../ui/FadeIn";
import Section from "../ui/Section";
import { Terminal, Cpu, Layers } from "lucide-react";
import GitHubStats from "./GitHubStats";

export default function About() {
  return (
    <Section id="about" className="py-32 relative">
      <FadeIn className="mb-16 text-center lg:text-left relative z-10 px-6 max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
          Behind the <span className="text-zinc-500">Code</span>
        </h2>
      </FadeIn>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 lg:px-0 relative z-10">
        
        {/* Main Bio Card */}
        <FadeIn className="lg:col-span-2 group relative glass-effect rounded-3xl p-8 md:p-12 border border-white/[0.04] bg-white/[0.01] overflow-hidden transition-all duration-500 hover:border-white/[0.12] hover:bg-white/[0.03] hover:shadow-[0_0_40px_rgba(255,255,255,0.02)]" data-cursor="scale">
          {/* macOS Window Controls */}
          <div className="absolute top-5 left-5 flex items-center gap-1.5 z-20">
            <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-500/50"></div>
          </div>
          
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative z-10 flex flex-col h-full justify-center">
            <Terminal className="w-8 h-8 text-zinc-500 mb-8 group-hover:text-emerald-400 transition-colors duration-500" />
            <h3 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight text-white text-balance leading-snug">
              Engineering <span className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">precision</span>.<br /> 
              Digital <span className="text-zinc-400">simplicity</span>.
            </h3>
            <div className="space-y-6">
              <p className="text-lg text-muted leading-relaxed">
                I am a Full Stack Developer with a deep passion for building 
                high-performance, scalable applications. My expertise spans 
                across mobile ecosystems and the modern web, with an absolute 
                focus on creating seamless, uncompromised user experiences.
              </p>
              <p className="text-lg text-muted leading-relaxed">
                When I'm not architecting large-scale web platforms, I dive deep into systems programming—always looking for the most elegant solution to the hardest problems.
              </p>
            </div>
          </div>
        </FadeIn>

        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* AI & Embedded Card */}
          <FadeIn delay={0.1} className="flex-1 group relative glass-effect rounded-3xl p-8 border border-white/[0.04] bg-white/[0.01] overflow-hidden transition-all duration-500 hover:border-white/[0.12] hover:bg-white/[0.03] hover:shadow-[0_0_40px_rgba(139,92,246,0.05)]" data-cursor="scale">
             <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-violet-500/15 rounded-full blur-[80px] pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-700" />
             <div className="relative z-10 flex flex-col h-full justify-center">
               <div className="flex items-center gap-4 mb-5">
                 <div className="p-3 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 group-hover:bg-violet-500/20 transition-colors">
                   <Cpu className="w-6 h-6" />
                 </div>
                 <h4 className="text-xl font-bold text-white tracking-tight">Silicon & AI</h4>
               </div>
               <p className="text-sm text-muted leading-relaxed">
                 Fascinated by the intersection of AI and hardware. I explore how intelligent software can interact directly with the physical world through embedded systems and microcontrollers.
               </p>
             </div>
          </FadeIn>

          {/* Philosophy Card */}
          <FadeIn delay={0.2} className="flex-1 group relative glass-effect rounded-3xl p-8 border border-white/[0.04] bg-white/[0.01] overflow-hidden transition-all duration-500 hover:border-white/[0.12] hover:bg-white/[0.03] hover:shadow-[0_0_40px_rgba(14,165,233,0.05)]" data-cursor="scale">
             <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-sky-500/15 rounded-full blur-[80px] pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-700" />
             <div className="relative z-10 flex flex-col h-full justify-center">
               <div className="flex items-center gap-4 mb-5">
                 <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 group-hover:bg-sky-500/20 transition-colors">
                   <Layers className="w-6 h-6" />
                 </div>
                 <h4 className="text-xl font-bold text-white tracking-tight">Design Ethos</h4>
               </div>
               <p className="text-sm text-muted leading-relaxed">
                 Minimalism isn't just a visual style—it's an engineering principle. I believe in writing code that is as clean and maintainable under the hood as the interfaces it powers.
               </p>
             </div>
          </FadeIn>

          {/* GitHub Stats Card */}
          <GitHubStats />
        </div>

      </div>
    </Section>
  );
}
