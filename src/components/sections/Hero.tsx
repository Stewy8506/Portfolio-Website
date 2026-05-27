"use client";

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import FadeIn from "../ui/FadeIn";
import TextReveal from "../ui/TextReveal";
import Button from "../ui/Button";
import { ArrowRight, Download, TerminalSquare, Mail } from "lucide-react";
import { useSoundEffect } from "@/hooks/useSoundEffect";
import Magnetic from "../ui/Magnetic";
import { scrollToSection } from "@/lib/navigation";
import { GitHubIcon, LinkedInIcon } from "../ui/BrandIcons";
import { useLoading } from "../layout/ClientLayoutWrapper";

export default function Hero() {
  const { playThocc } = useSoundEffect();

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });
  const gradientX = useTransform(springX, [0, 1], ["80%", "20%"]);
  const gradientY = useTransform(springY, [0, 1], ["20%", "80%"]);


  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  const { isSiteReady } = useLoading();

  const handleScroll = (id: string) => {
    scrollToSection(id);
  };

  if (!isSiteReady) {
    return (
      <section className="relative min-h-screen w-full flex items-center overflow-hidden opacity-0 pointer-events-none">
        <div className="absolute pointer-events-none select-none">
          <h1>Anuvab Das.</h1>
          <p>Architecting elite digital systems with uncompromising precision</p>
          <p>Building the future of digital experiences.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen w-full flex items-center overflow-hidden">

      {/* Dynamic mouse-tracking gradient orb */}
      <motion.div
        style={{ left: gradientX, top: gradientY }}
        className="absolute w-[800px] h-[800px] rounded-full pointer-events-none z-0"
        animate={{ opacity: [0.1, 0.18, 0.1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-full h-full rounded-full bg-emerald-500/10 blur-[140px]" />
      </motion.div>

      {/* MOBILE HERO (OLD DESIGN) */}
      <div className="flex md:hidden relative z-10 text-center px-6 max-w-4xl flex-col items-center justify-center w-full h-full pointer-events-auto">
        <FadeIn delay={0.1}>
          <h1 className="text-4xl font-bold tracking-tighter leading-none mb-4 whitespace-nowrap">
            Hi, I&apos;m{" "}
            <span className="relative inline-block">
              <span
                className="absolute inset-0 bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-emerald-400 select-none pointer-events-none"
                style={{ filter: "blur(14px)", opacity: 0.3 }}
              >
                Anuvab
              </span>
              <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-emerald-200 to-emerald-500">
                Anuvab
              </span>
              <div className="absolute pointer-events-none z-10" style={{ top: "-15%", left: "6%", filter: "drop-shadow(0 0 5px #fff) drop-shadow(0 0 10px rgba(34, 211, 238, 0.85))" }}>
                <div className="sparkle-star" style={{ animationDelay: "0s" }} />
              </div>
              <div className="absolute pointer-events-none z-10" style={{ top: "25%", left: "30%", filter: "drop-shadow(0 0 5px #fff) drop-shadow(0 0 10px rgba(34, 211, 238, 0.85))" }}>
                <div className="sparkle-star" style={{ animationDelay: "0.6s" }} />
              </div>
              <div className="absolute pointer-events-none z-10" style={{ top: "20%", left: "48%", filter: "drop-shadow(0 0 5px #fff) drop-shadow(0 0 10px rgba(34, 211, 238, 0.85))" }}>
                <div className="sparkle-star" style={{ animationDelay: "1.2s" }} />
              </div>
              <div className="absolute pointer-events-none z-10" style={{ top: "30%", left: "66%", filter: "drop-shadow(0 0 5px #fff) drop-shadow(0 0 10px rgba(34, 211, 238, 0.85))" }}>
                <div className="sparkle-star" style={{ animationDelay: "1.8s" }} />
              </div>
              <div className="absolute pointer-events-none z-10" style={{ top: "-20%", left: "86%", filter: "drop-shadow(0 0 5px #fff) drop-shadow(0 0 10px rgba(34, 211, 238, 0.85))" }}>
                <div className="sparkle-star" style={{ animationDelay: "2.4s" }} />
              </div>
            </span>
            <span className="text-emerald-500">.</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <h2 className="text-2xl font-medium tracking-tight text-zinc-400 mb-8 max-w-3xl mx-auto leading-tight">
            Building the <span className="text-white font-semibold">future of digital</span> experiences.
          </h2>
        </FadeIn>

        <TextReveal delay={1.0} className="text-lg text-muted mb-10 max-w-2xl mx-auto text-balance justify-center text-center">
          Full stack developer specializing in high-performance apps with React Native, Flutter, and AI-driven products. Crafting minimal, premium interfaces.
        </TextReveal>

        <FadeIn delay={0.4}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <Magnetic strength={0.2}>
              <Button
                variant="primary"
                className="group flex items-center justify-center gap-2 w-full whitespace-nowrap"
                data-cursor="button"
                onMouseEnter={playThocc}
                onClick={() => handleScroll("projects")}
              >
                View Projects
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Magnetic>
            <Magnetic strength={0.2}>
              <a href="/resume.pdf" download="Anuvab_Resume.pdf" tabIndex={-1} className="w-full flex" onMouseEnter={playThocc}>
                <Button variant="outline" className="group flex items-center justify-center gap-2 w-full whitespace-nowrap" data-cursor="button">
                  Download Resume
                  <Download className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                </Button>
              </a>
            </Magnetic>
          </div>
        </FadeIn>
      </div>

      {/* DESKTOP HERO (NEW DESIGN) */}
      <div className="relative z-10 w-full h-full min-h-screen max-w-[1600px] mx-auto px-6 md:px-12 hidden md:grid grid-cols-12 gap-6 pt-24 pb-32 pointer-events-none">

        {/* LEFT COLUMN - Massive Typography & Pitch */}
        <div className="col-span-12 xl:col-span-8 flex flex-col h-full min-h-[75vh] pointer-events-auto">

          <div className="flex-1 flex flex-col justify-center w-full relative pt-12 md:pt-16 xl:pt-20" style={{ perspective: "1200px" }}>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.08, delayChildren: 0.1 }}
              className="leading-none flex items-baseline overflow-visible pt-20 -mt-20 whitespace-nowrap"
            >
              <motion.span
                initial={{ y: "100%", opacity: 0, rotateZ: 4 }}
                animate={{ y: 0, opacity: 1, rotateZ: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex items-baseline overflow-visible"
              >
                {"Anuvab Das.".split("").map((char, i) => {
                  const isAnuvab = i >= 0 && i <= 5;
                  const isSpace = i === 6;
                  const isDas = i >= 7 && i <= 9;
                  const isDot = i === 10;

                  let textStyles = "";
                  let hoverGlow = "";

                  if (isAnuvab) {
                    textStyles = "font-black tracking-tight text-[13vw] sm:text-[10vw] xl:text-[8rem] 2xl:text-[9rem] bg-gradient-to-b from-cyan-100 via-cyan-300 to-cyan-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]";
                    hoverGlow = "brightness(1.5) drop-shadow(0px 0px 20px rgba(6,182,212,0.5))";
                  } else if (isDas) {
                    const isFirstOfDas = i === 7;
                    textStyles = `font-quicksand font-light italic tracking-[0.02em] px-[0.15em] -mx-[0.15em] text-[11vw] sm:text-[8vw] xl:text-[6.4rem] 2xl:text-[7rem] bg-gradient-to-b from-white via-zinc-200 to-zinc-400 drop-shadow-[0_0_8px_rgba(255,255,255,0.15)] ${isFirstOfDas ? "ml-1" : ""}`;
                    hoverGlow = "brightness(1.4) drop-shadow(0px 0px 15px rgba(255,255,255,0.5))";
                  } else if (isDot) {
                    textStyles = "font-black text-[8vw] sm:text-[6vw] xl:text-[4rem] 2xl:text-[4.5rem] bg-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]";
                    hoverGlow = "brightness(1.5) drop-shadow(0px 0px 15px rgba(255,255,255,0.6))";
                  } else if (isSpace) {
                    textStyles = "text-[13vw] sm:text-[10vw] xl:text-[8rem] 2xl:text-[9rem]";
                  }

                  return (
                    <motion.span
                      key={i}
                      className={`relative inline-block origin-bottom bg-clip-text text-transparent ${textStyles}`}
                      data-cursor={isAnuvab ? "target" : undefined}
                      whileHover={isAnuvab ? {
                        y: -14,
                        scale: 1.08,
                        rotateX: -10,
                        rotateY: i % 2 === 0 ? 8 : -8,
                        z: 35,
                        filter: hoverGlow
                      } : undefined}
                      transition={{ type: "spring", stiffness: 380, damping: 14 }}
                    >
                      {char === " " ? "\u00A0" : char}

                      {/* Re-attach sparkles to specific letter indices */}
                      {i === 0 && ( // 'A'
                        <div className="absolute pointer-events-none z-10" style={{ top: "0%", left: "10%", filter: "drop-shadow(0 0 5px #fff) drop-shadow(0 0 10px rgba(34, 211, 238, 0.85))" }}>
                          <div className="sparkle-star" style={{ animationDelay: "0s" }} />
                        </div>
                      )}
                      {i === 1 && ( // 'n'
                        <div className="absolute pointer-events-none z-10" style={{ top: "35%", left: "30%", filter: "drop-shadow(0 0 5px #fff) drop-shadow(0 0 10px rgba(34, 211, 238, 0.85))" }}>
                          <div className="sparkle-star" style={{ animationDelay: "0.6s" }} />
                        </div>
                      )}
                      {i === 2 && ( // 'u'
                        <div className="absolute pointer-events-none z-10" style={{ top: "30%", left: "60%", filter: "drop-shadow(0 0 5px #fff) drop-shadow(0 0 10px rgba(34, 211, 238, 0.85))" }}>
                          <div className="sparkle-star" style={{ animationDelay: "1.2s" }} />
                        </div>
                      )}
                      {i === 4 && ( // 'a'
                        <div className="absolute pointer-events-none z-10" style={{ top: "40%", left: "70%", filter: "drop-shadow(0 0 5px #fff) drop-shadow(0 0 10px rgba(34, 211, 238, 0.85))" }}>
                          <div className="sparkle-star" style={{ animationDelay: "1.8s" }} />
                        </div>
                      )}
                      {i === 5 && ( // 'b'
                        <div className="absolute pointer-events-none z-10" style={{ top: "0%", left: "60%", filter: "drop-shadow(0 0 5px #fff) drop-shadow(0 0 10px rgba(34, 211, 238, 0.85))" }}>
                          <div className="sparkle-star" style={{ animationDelay: "2.4s" }} />
                        </div>
                      )}
                    </motion.span>
                  );
                })}
              </motion.span>
            </motion.h1>

            {/* Location Widget directly below the title */}
            <FadeIn delay={0.3} className="mt-6 md:mt-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md self-start">
                <div className="relative flex h-2 w-2 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </div>
                <span className="text-xs text-zinc-400 font-medium tracking-wide">Kolkata, India</span>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.4} className="mt-auto mb-4 max-w-5xl">
            <p className="text-2xl md:text-3xl lg:text-4xl text-zinc-500 leading-tight font-light text-balance">
              Architecting <span className="text-white font-semibold">elite digital systems</span> with <span className="text-emerald-400 italic font-medium">uncompromising precision</span>
            </p>
          </FadeIn>
        </div>

        {/* RIGHT COLUMN - Terminal & Actions */}
        <div className="col-span-12 xl:col-span-4 flex flex-col justify-end h-full pointer-events-auto">

          {/* THE LIVE TERMINAL WIDGET */}
          <FadeIn delay={0.2} className="w-full mb-12">
            <div className="border border-white/10 bg-black/40 backdrop-blur-md rounded-xl p-6 relative overflow-hidden flex flex-col">

              {/* Widget Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <TerminalSquare className="w-4 h-4 text-emerald-500" />
                  <span className="font-mono text-[10px] text-emerald-500 tracking-[0.2em] uppercase">
                    Live.Terminal
                  </span>
                </div>
              </div>

              {/* Widget Content Container */}
              <div className="flex-1 relative">
                <div className="bg-zinc-950/80 border border-white/5 rounded p-4 font-mono text-xs shadow-inner">
                  <div className="flex gap-2 mb-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="text-zinc-500 mb-1.5">$ whoami</div>
                  <div className="text-emerald-400 mb-3">anuvab_das</div>
                  <div className="text-zinc-500 mb-1.5">$ get_status --current</div>
                  <div className="text-white">Building high-performance apps...</div>
                  <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-2 h-3.5 bg-emerald-500 mt-2" />
                </div>
              </div>
            </div>
          </FadeIn>

          {/* THE ACTION HUB */}
          <FadeIn delay={0.4} className="w-full flex flex-col items-start xl:items-end gap-5">

            <div className="flex flex-col items-start xl:items-end gap-3 w-full border-t border-white/10 pt-6">
              <Magnetic strength={0.1}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { playThocc(); handleScroll("projects"); }}
                  onMouseEnter={playThocc}
                  className="group flex items-center gap-3 text-white hover:text-emerald-400 transition-colors"
                >
                  <span className="font-mono text-xs text-zinc-500 group-hover:text-emerald-500 transition-colors">01.</span>
                  <span className="font-bold tracking-widest uppercase text-sm">View_Projects</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Magnetic>

              <Magnetic strength={0.1}>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/resume.pdf"
                  download="Anuvab_Resume.pdf"
                  tabIndex={-1}
                  onMouseEnter={playThocc}
                  className="group flex items-center gap-3 text-zinc-400 hover:text-white transition-colors"
                >
                  <span className="font-mono text-xs text-zinc-600 group-hover:text-white transition-colors">02.</span>
                  <span className="font-bold tracking-widest uppercase text-sm">Download_CV</span>
                  <Download className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                </motion.a>
              </Magnetic>
            </div>

            <div className="flex items-center gap-8 mt-8 w-full justify-center">
              <motion.a whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} href="https://github.com/Stewy8506" target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-emerald-400 transition-colors" onClick={playThocc}><GitHubIcon className="w-7 h-7" /></motion.a>
              <motion.a whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} href="https://www.linkedin.com/in/anv-dev/" target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-emerald-400 transition-colors" onClick={playThocc}><LinkedInIcon className="w-7 h-7" /></motion.a>
              <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} onClick={() => { playThocc(); handleScroll("contact"); }} className="text-zinc-500 hover:text-emerald-400 transition-colors"><Mail className="w-7 h-7" /></motion.button>
            </div>
          </FadeIn>

        </div>
      </div>
    </section>
  );
}
