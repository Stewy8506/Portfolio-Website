"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import FadeIn from "../ui/FadeIn";
import Button from "../ui/Button";
import { ArrowRight, Download } from "lucide-react";
import { useSoundEffect } from "@/hooks/useSoundEffect";
import Magnetic from "../ui/Magnetic";
import TextReveal from "../ui/TextReveal";
import { scrollToSection } from "@/lib/navigation";

export default function Hero() {
  const { playThocc } = useSoundEffect();

  const handleScroll = (id: string) => {
    scrollToSection(id);
  };

  // Mouse-tracking gradient orbs
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const gradientX = useTransform(springX, [0, 1], ["20%", "80%"]);
  const gradientY = useTransform(springY, [0, 1], ["20%", "80%"]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">

      {/* Dynamic mouse-tracking gradient orb */}
      <motion.div
        style={{ left: gradientX, top: gradientY }}
        className="absolute -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        animate={{ opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-full h-full rounded-full bg-emerald-500/20 blur-[120px]" />
      </motion.div>

      {/* Secondary ambient orb — opposite corner drift */}
      <motion.div
        animate={{
          x: ["-10%", "10%", "-10%"],
          y: ["5%", "-5%", "5%"],
          opacity: [0.06, 0.14, 0.06],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-white/5 blur-[100px] pointer-events-none"
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
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[7.5rem] xl:text-[8.5rem] font-bold tracking-tighter leading-none mb-4 whitespace-nowrap">
            Hi, I&apos;m{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-200 to-emerald-500">
              Anuvab
            </span>
            <span className="text-emerald-500">.</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.25}>
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight text-zinc-400 mb-8 max-w-3xl mx-auto leading-tight">
            Building the <span className="text-white font-semibold">future of digital</span> experiences.
          </h2>
        </FadeIn>

        <TextReveal delay={0.3} className="text-lg md:text-xl text-muted mb-10 max-w-2xl mx-auto text-balance justify-center text-center">
          Full stack developer specializing in high-performance apps with React Native, Flutter, and AI-driven products. Crafting minimal, premium interfaces.
        </TextReveal>

        <FadeIn delay={0.4}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <Magnetic strength={0.2}>
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
            </Magnetic>
            <Magnetic strength={0.2}>
              <a href="/resume.pdf" download="Anuvab_Resume.pdf" tabIndex={-1} className="w-full sm:w-auto flex" onMouseEnter={playThocc}>
                <Button variant="outline" className="group flex items-center justify-center gap-2 w-full sm:w-auto whitespace-nowrap" data-cursor="button">
                  Download Resume
                  <Download className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                </Button>
              </a>
            </Magnetic>
            <Magnetic strength={0.2}>
              <Button
                variant="outline"
                data-cursor="button"
                className="w-full sm:w-auto justify-center whitespace-nowrap"
                onMouseEnter={playThocc}
                onClick={() => handleScroll("contact")}
              >
                Get in touch
              </Button>
            </Magnetic>
          </div>
        </FadeIn>
      </div>

    </section>
  );
}
