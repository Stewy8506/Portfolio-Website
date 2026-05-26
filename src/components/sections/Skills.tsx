/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element, react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import FadeIn from "../ui/FadeIn";
import Section from "../ui/Section";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import HoverSpotlight from "../ui/HoverSpotlight";

const MarqueeRow = ({ 
  items, 
  speed = 40, 
  direction = "left" 
}: { 
  items: any[], 
  speed?: number, 
  direction?: "left" | "right" 
}) => {
  if (!items || items.length === 0) return null;
  return (
    <div 
      className="flex w-full overflow-hidden relative py-3"
      style={{ WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)", maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}
    >
      <motion.div
        className="flex w-max gap-6 px-3"
        initial={{ x: direction === "left" ? 0 : "-50%" }}
        animate={{ x: direction === "left" ? "-50%" : 0 }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {[...items, ...items, ...items].map((item, idx) => (
          <HoverSpotlight 
            key={`${item.id}-${idx}`}
            className="rounded-2xl glass-effect border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/[0.15] hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all duration-300 cursor-default group"
            innerClassName="flex items-center gap-4 px-8 py-5 w-full h-full"
          >
            <div className="w-8 h-8 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center drop-shadow-md">
              <img 
                src={`https://cdn.simpleicons.org/${item.slug}${item.white ? '/white' : ''}`} 
                alt={item.name}
                className="w-full h-full object-contain"
                width={32}
                height={32}
                loading="lazy"
                onError={(e) => (e.currentTarget.src = "/favicon.ico")}
              />
            </div>
            <span className="text-xl font-semibold text-zinc-300 group-hover:text-white transition-colors tracking-tight">
              {item.name}
            </span>
          </HoverSpotlight>
        ))}
      </motion.div>
    </div>
  )
}

export default function Skills() {
  const [skills, setSkills] = useState<any[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    fetch("/api/skills")
      .then(res => res.json())
      .then(data => setSkills(data))
      .catch(err => console.error("Failed to fetch skills", err));
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(skills.map(s => s.category));
    return ["All", ...Array.from(cats).filter(Boolean)];
  }, [skills]);

  const filteredSkills = useMemo(() => {
    if (activeCategory === "All") return skills;
    return skills.filter(s => s.category === activeCategory);
  }, [skills, activeCategory]);

  // Split skills into 3 rows for the marquee
  const row1 = skills.slice(0, Math.ceil(skills.length / 3));
  const row2 = skills.slice(Math.ceil(skills.length / 3), Math.ceil((skills.length * 2) / 3));
  const row3 = skills.slice(Math.ceil((skills.length * 2) / 3));

  return (
    <Section id="skills" className="py-32 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <FadeIn className="mb-12 text-center relative z-10 px-6">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-5">
          Technical <span className="text-zinc-500">Ecosystem</span>
        </h2>
        <p className="text-muted text-lg max-w-2xl mx-auto text-balance">
          A dynamic, full-stack arsenal built for architecting high-performance applications, 
          from low-level systems to cutting-edge AI and mobile experiences.
        </p>
      </FadeIn>

      <div className="relative z-10 flex flex-col items-center w-full max-w-[100vw]">
        
        <AnimatePresence mode="wait">
          {!showAll ? (
            <motion.div 
              key="marquee"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              transition={{ duration: 0.4 }}
              className="w-full flex flex-col gap-2"
            >
              <MarqueeRow items={row1} speed={45} direction="left" />
              <MarqueeRow items={row2} speed={55} direction="right" />
              <MarqueeRow items={row3} speed={40} direction="left" />
            </motion.div>
          ) : (
            <motion.div 
              key="grid"
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-6xl mx-auto px-6"
            >
              <div className="flex flex-wrap justify-center gap-3 mb-12 bg-white/[0.02] p-1.5 rounded-full border border-white/[0.05] max-w-max mx-auto backdrop-blur-md">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className="relative px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-300"
                  >
                    {activeCategory === category && (
                      <motion.span
                        layoutId="activeCategoryBg"
                        className="absolute inset-0 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                        transition={{ type: "spring", stiffness: 350, damping: 28 }}
                      />
                    )}
                    <span className={cn(
                      "relative z-10 transition-colors duration-300",
                      activeCategory === category 
                        ? "text-zinc-950 font-semibold" 
                        : "text-zinc-400 hover:text-zinc-100"
                    )}>
                      {category}
                    </span>
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeCategory}
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.04,
                      }
                    },
                    exit: {
                      opacity: 0,
                      transition: {
                        staggerChildren: 0.02,
                        staggerDirection: -1,
                      }
                    }
                  }}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                >
                  {filteredSkills.map((skill) => (
                    <motion.div
                      key={skill.id}
                      variants={{
                        hidden: { opacity: 0, y: 20, scale: 0.95, filter: "blur(4px)" },
                        show: { 
                          opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
                          transition: { type: "spring", stiffness: 350, damping: 30 }
                        },
                        exit: { 
                          opacity: 0, y: -20, scale: 0.95, filter: "blur(4px)",
                          transition: { duration: 0.2, ease: "easeInOut" }
                        }
                      }}
                      className="cursor-default"
                    >
                      <HoverSpotlight 
                        className="rounded-2xl glass-effect border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/[0.15] hover:-translate-y-2 transition-all duration-300 group h-full"
                        innerClassName="flex flex-col items-center justify-center gap-4 p-6 w-full h-full"
                      >
                        <div className="w-12 h-12 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center drop-shadow-md">
                          <img 
                            src={`https://cdn.simpleicons.org/${skill.slug}${skill.white ? '/white' : ''}`} 
                            alt={skill.name}
                            className="w-full h-full object-contain"
                            width={48}
                            height={48}
                            loading="lazy"
                            onError={(e) => (e.currentTarget.src = "/favicon.ico")}
                          />
                        </div>
                        <span className="text-sm font-semibold text-zinc-300 group-hover:text-white transition-colors text-center">
                          {skill.name}
                        </span>
                      </HoverSpotlight>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => {
            setShowAll(!showAll);
            setActiveCategory("All");
          }}
          className="mt-16 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-300 flex items-center gap-2"
        >
          {showAll ? "Show Less" : "Show All Skills"}
        </motion.button>
        
      </div>
      
    </Section>
  );
}
