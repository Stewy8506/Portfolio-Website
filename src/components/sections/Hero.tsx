"use client";

import { motion } from "framer-motion";
import FadeIn from "../ui/FadeIn";
import Button from "../ui/Button";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-background">
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
        <FadeIn delay={0.1}>
          <span className="inline-block py-1 px-3 rounded-full bg-white/[0.05] border border-white/[0.1] text-xs font-medium text-muted mb-6 tracking-wider uppercase">
            Available for new opportunities
          </span>
        </FadeIn>

        <FadeIn delay={0.2}>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-tight mb-8">
            Building the <br /> 
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
              future of digital
            </span>
            <br /> experiences.
          </h1>
        </FadeIn>

        <FadeIn delay={0.3}>
          <p className="text-lg md:text-xl text-muted mb-10 max-w-2xl mx-auto text-balance">
            Full stack developer specializing in high-performance apps with React Native, 
            Flutter, and AI-driven products. Crafting minimal, premium interfaces.
          </p>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" className="group flex items-center gap-2">
              View Projects
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline">
              Get in touch
            </Button>
          </div>
        </FadeIn>
      </div>

      {/* Subtle bottom fade to transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
