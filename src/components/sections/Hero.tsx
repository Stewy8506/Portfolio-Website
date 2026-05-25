"use client";

import { motion } from "framer-motion";
import FadeIn from "../ui/FadeIn";
import Button from "../ui/Button";
import { ArrowRight, Download } from "lucide-react";
import { useSoundEffect } from "@/hooks/useSoundEffect";

export default function Hero() {
  const { playThocc } = useSoundEffect();

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 bg-gradient-radial pointer-events-none"
      />

      <div className="relative z-10 text-center px-6 max-w-4xl">
        <FadeIn delay={0.15}>
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/[0.1] border border-emerald-500/[0.2] backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-medium text-emerald-400 tracking-wide uppercase text-xs">
                Available for new opportunities
              </span>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-tight mb-4">
            Hi, I'm <br className="md:hidden" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-200 to-emerald-500">
              Anuvab
            </span>
            <span className="text-emerald-500">.</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.25}>
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-zinc-400 mb-8 max-w-3xl mx-auto leading-tight">
            Building the <span className="text-white">future of digital</span> experiences.
          </h2>
        </FadeIn>

        <FadeIn delay={0.3}>
          <p className="text-lg md:text-xl text-muted mb-10 max-w-2xl mx-auto text-balance">
            Full stack developer specializing in high-performance apps with React Native,
            Flutter, and AI-driven products. Crafting minimal, premium interfaces.
          </p>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <Button 
              variant="primary" 
              className="group flex items-center justify-center gap-2 w-full sm:w-auto whitespace-nowrap" 
              data-cursor="button" 
              onMouseEnter={playThocc}
              onClick={() => handleScroll("projects")}
            >
              View Projects
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <a href="/resume.pdf" download="Anuvab_Resume.pdf" tabIndex={-1} className="w-full sm:w-auto flex" onMouseEnter={playThocc}>
              <Button variant="outline" className="group flex items-center justify-center gap-2 w-full sm:w-auto whitespace-nowrap" data-cursor="button">
                Download Resume
                <Download className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </a>
            <Button 
              variant="outline" 
              data-cursor="button" 
              className="w-full sm:w-auto justify-center whitespace-nowrap" 
              onMouseEnter={playThocc}
              onClick={() => handleScroll("contact")}
            >
              Get in touch
            </Button>
          </div>
        </FadeIn>
      </div>

    </section>
  );
}
