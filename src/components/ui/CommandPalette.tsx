"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Download, Volume2, ArrowRight } from "lucide-react";
import { useSoundEffect } from "@/hooks/useSoundEffect";

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { playThocc } = useSoundEffect();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const actions = [
    { id: "projects", label: "View Projects", icon: ArrowRight, action: () => { window.location.hash = "projects"; setIsOpen(false); } },
    { id: "about", label: "Go to About", icon: ArrowRight, action: () => { window.location.hash = "about"; setIsOpen(false); } },
    { id: "contact", label: "Get in Touch", icon: ArrowRight, action: () => { window.location.hash = "contact"; setIsOpen(false); } },
    { id: "resume", label: "Download Resume", icon: Download, action: () => { 
        const link = document.createElement("a");
        link.href = "/resume.pdf";
        link.download = "Anuvab_Resume.pdf";
        link.click();
        setIsOpen(false);
    } },
    { id: "sound", label: "Toggle Ambient Sound", icon: Volume2, action: () => {
        const event = new CustomEvent('toggleSound');
        window.dispatchEvent(event);
        setIsOpen(false);
    } }
  ];

  const filteredActions = actions.filter(a => a.label.toLowerCase().includes(search.toLowerCase()));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999999] flex items-start justify-center pt-[20vh] px-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="flex items-center px-4 py-4 border-b border-white/10">
              <Search className="w-5 h-5 text-zinc-500 mr-3" />
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none text-lg"
              />
              <div className="text-[10px] text-zinc-500 font-mono bg-zinc-800 px-2 py-1 rounded border border-white/5">
                ESC
              </div>
            </div>
            <div className="p-2 max-h-[60vh] overflow-y-auto">
              {filteredActions.length === 0 ? (
                <div className="p-4 text-center text-zinc-500 text-sm">No commands found.</div>
              ) : (
                filteredActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => { playThocc(); action.action(); }}
                    onMouseEnter={playThocc}
                    className="w-full flex items-center px-3 py-3 rounded-xl hover:bg-white/5 text-left transition-colors group cursor-pointer"
                    data-cursor="none"
                  >
                    <action.icon className="w-4 h-4 text-zinc-400 group-hover:text-emerald-400 mr-3 transition-colors" />
                    <span className="text-zinc-300 group-hover:text-white text-sm font-medium">{action.label}</span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
