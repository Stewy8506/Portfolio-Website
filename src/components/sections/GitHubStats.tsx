"use client";

import React, { useEffect, useState } from "react";
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

  if (!data) return null;

  return (
    <FadeIn delay={0.3} className="flex-1 w-full" data-cursor="scale">
      <a href={data.html_url} target="_blank" rel="noreferrer" className="block w-full h-full outline-none">
        <div className="group relative h-full glass-effect rounded-3xl p-6 border border-white/[0.04] bg-white/[0.01] overflow-hidden transition-all duration-500 hover:border-white/[0.12] hover:bg-white/[0.03] hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] flex flex-col justify-between">
          <div className="absolute bottom-0 right-0 w-[150px] h-[150px] bg-emerald-500/10 rounded-full blur-[60px] pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative z-10 flex items-center justify-between w-full mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-white group-hover:bg-white/10 transition-colors">
                <GithubIcon className="w-5 h-5" />
              </div>
              <span className="font-semibold text-white tracking-tight">GitHub Activity</span>
            </div>
          </div>
          
          <div className="relative z-10 flex items-center justify-around w-full mt-2">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-white group-hover:text-emerald-400 transition-colors">{data.public_repos}</span>
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1 font-semibold">Repositories</span>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-white group-hover:text-emerald-400 transition-colors">{data.total_commits}</span>
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1 font-semibold">Total Commits</span>
            </div>
          </div>
        </div>
      </a>
    </FadeIn>
  );
}
