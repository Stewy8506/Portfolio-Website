"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import FadeIn from "../ui/FadeIn";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.24c3-.34 6-1.5 6-6.76 0-1.5-.5-2.8-1.4-3.8.15-.38.65-1.8-.15-3.8 0 0-1.2-.4-3.9 1.4a13 13 0 0 0-7 0c-2.7-1.8-3.9-1.4-3.9-1.4-.8 2-.3 3.4-.15 3.8-1 1-1.5 2.3-1.5 3.8 0 5.2 3 6.4 6 6.76a4.8 4.8 0 0 0-1 3.24v4" />
  </svg>
);

export default function GitHubStats() {
  const [data, setData] = useState<{ total_commits: number; public_repos: number; html_url: string } | null>(null);

  useEffect(() => {
    fetch("/api/github")
      .then(res => res.json())
      .then(d => {
        if (!d.error) setData(d);
      })
      .catch(() => {});
  }, []);

  const squares = useMemo(() => {
    return Array.from({ length: 28 }, () => Math.floor(Math.random() * 4));
  }, []);

  if (!data) return null;

  return (
    <FadeIn delay={0.3} className="flex-1 w-full" data-cursor="scale">
      <a href={data.html_url} target="_blank" rel="noreferrer" className="block w-full h-full outline-none">
        <div className="group relative h-full glass-effect rounded-3xl p-6 border border-white/[0.04] bg-white/[0.01] overflow-hidden transition-all duration-500 hover:border-white/[0.12] hover:bg-white/[0.03] hover:shadow-[0_0_40px_rgba(52,211,153,0.1)] flex flex-col justify-between">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-emerald-500/10 rounded-full blur-[70px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative z-10 flex items-center justify-between w-full mb-6">
            <div className="flex items-center gap-3">
              <motion.div 
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5, ease: "backOut" }}
                className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-white group-hover:bg-emerald-500/20 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-colors"
              >
                <GithubIcon className="w-5 h-5" />
              </motion.div>
              <span className="font-semibold text-white tracking-tight">GitHub Activity</span>
            </div>
            
            <div className="flex gap-1 group-hover:scale-110 transition-transform duration-300">
               <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-500" animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} />
               <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-400" animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2, delay: 0.3 }} />
               <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-300" animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2, delay: 0.6 }} />
            </div>
          </div>

          {/* Fake Contribution Graph */}
          <div className="relative z-10 grid grid-cols-7 gap-1.5 mb-6 group-hover:scale-[1.02] transition-transform duration-500">
             {squares.map((intensity, i) => (
               <motion.div 
                 key={i} 
                 custom={i}
                 variants={{
                   hidden: { opacity: 0.5, scale: 0.8 },
                   show: (idx: number) => ({
                     opacity: 1,
                     scale: 1,
                     transition: { delay: idx * 0.02, duration: 0.2 }
                   })
                 }}
                 initial="hidden"
                 animate="show"
                 whileHover={{ 
                   scale: 1.5, 
                   zIndex: 10, 
                   borderRadius: "4px",
                   transition: { type: "spring", stiffness: 350, damping: 25 }
                 }}
                 className={`w-full aspect-square rounded-sm ${
                   intensity === 0 ? "bg-white/5" :
                   intensity === 1 ? "bg-emerald-900/50" :
                   intensity === 2 ? "bg-emerald-600/60" :
                   "bg-emerald-400/80"
                 }`}
               />
             ))}
          </div>
          
          <div className="relative z-10 flex items-center justify-around w-full mt-auto bg-white/5 rounded-2xl p-4 border border-white/5 group-hover:bg-white/10 group-hover:border-white/10 transition-colors">
            <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">{data.public_repos}</span>
              <span className="text-[10px] uppercase tracking-widest text-zinc-400 mt-1 font-semibold">Repos</span>
            </motion.div>
            <div className="w-px h-8 bg-white/10" />
            <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">{data.total_commits}</span>
              <span className="text-[10px] uppercase tracking-widest text-zinc-400 mt-1 font-semibold">Commits</span>
            </motion.div>
          </div>
        </div>
      </a>
    </FadeIn>
  );
}
