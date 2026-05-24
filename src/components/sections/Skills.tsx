"use client";

import FadeIn from "../ui/FadeIn";
import Section from "../ui/Section";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const SKILLS = [
  {
    category: "Frontend",
    items: ["React.js", "Next.js 15", "TypeScript", "Tailwind CSS", "Framer Motion"],
    color: "bg-blue-500",
    glow: "rgba(59, 130, 246, 0.3)",
    icon: "🌐"
  },
  {
    category: "Mobile",
    items: ["React Native", "Flutter", "Dart", "iOS/Android Deployment"],
    color: "bg-purple-500",
    glow: "rgba(168, 85, 247, 0.3)",
    icon: "📱"
  },
  {
    category: "Backend & AI",
    items: ["Node.js", "PostgreSQL", "MongoDB", "OpenAI API", "LangChain"],
    color: "bg-emerald-500",
    glow: "rgba(16, 185, 129, 0.3)",
    icon: "🤖"
  },
  {
    category: "Low Level",
    items: ["C/C++", "Embedded C", "RTOS", "Arduino/ESP32"],
    color: "bg-orange-500",
    glow: "rgba(249, 115, 22, 0.3)",
    icon: "🔌"
  },
];

export default function Skills() {
  return (
    <Section id="skills" className="py-32 overflow-hidden">
      <FadeIn className="mb-20 text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
          Technical <span className="text-zinc-500">Arsenal</span>
        </h2>
        <p className="text-muted text-lg max-w-2xl mx-auto text-balance">
          A curated set of technologies I use to bring digital ideas to life, 
          from the silicon level to the cloud.
        </p>
      </FadeIn>

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Visual Centerpiece: A Bento-inspired Cluster */}
        <div className="grid grid-cols-12 grid-rows-6 gap-4 h-[800px] md:h-[600px]">
          
          {/* Frontend - Large Focus Box */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="col-span-12 md:col-span-7 row-span-3 glass-effect rounded-3xl p-8 border border-white/10 flex flex-col justify-between relative overflow-hidden group"
            data-cursor="scale"
          >
            <div className="absolute top-0 right-0 p-4 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">🌐</div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-blue-500 rounded-full" />
                Frontend Development
              </h3>
              <div className="flex flex-wrap gap-3">
                {SKILLS[0].items.map((item) => (
                  <span key={item} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm hover:bg-blue-500/20 hover:border-blue-500/50 transition-all cursor-default">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/10 blur-[80px] group-hover:bg-blue-500/20 transition-colors" />
          </motion.div>

          {/* Mobile - Medium Box */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="col-span-12 md:col-span-5 row-span-2 glass-effect rounded-3xl p-6 border border-white/10 relative overflow-hidden group"
            data-cursor="scale"
          >
            <div className="absolute top-0 right-0 p-4 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">📱</div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
              <span className="w-2 h-6 bg-purple-500 rounded-full" />
              Mobile Ecosystem
            </h3>
            <div className="flex flex-wrap gap-2">
              {SKILLS[1].items.map((item) => (
                <span key={item} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs hover:bg-purple-500/20 hover:border-purple-500/50 transition-all cursor-default">
                  {item}
                </span>
              ))}
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/10 blur-[60px] group-hover:bg-purple-500/20 transition-colors" />
          </motion.div>

          {/* Low Level - Tall Box */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="col-span-12 md:col-span-3 row-span-3 glass-effect rounded-3xl p-6 border border-white/10 relative overflow-hidden group"
            data-cursor="scale"
          >
            <div className="absolute top-0 right-0 p-4 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">🔌</div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
              <span className="w-2 h-6 bg-orange-500 rounded-full" />
              Low Level
            </h3>
            <div className="flex flex-col gap-3">
              {SKILLS[3].items.map((item) => (
                <div key={item} className="p-3 rounded-xl bg-white/5 border border-white/10 text-sm hover:bg-orange-500/20 hover:border-orange-500/50 transition-all cursor-default">
                  {item}
                </div>
              ))}
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-500/10 blur-[60px] group-hover:bg-orange-500/20 transition-colors" />
          </motion.div>

          {/* Backend/AI - Wide Box */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="col-span-12 md:col-span-9 row-span-2 glass-effect rounded-3xl p-6 border border-white/10 relative overflow-hidden group"
            data-cursor="scale"
          >
            <div className="absolute top-0 right-0 p-4 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">🤖</div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
              <span className="w-2 h-6 bg-emerald-500 rounded-full" />
              Backend & AI Intelligence
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {SKILLS[2].items.map((item) => (
                <div key={item} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-center hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all cursor-default">
                  {item}
                </div>
              ))}
            </div>
            <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-emerald-500/10 blur-[80px] group-hover:bg-emerald-500/20 transition-colors" />
          </motion.div>

        </div>
      </div>
    </Section>
  );
}
