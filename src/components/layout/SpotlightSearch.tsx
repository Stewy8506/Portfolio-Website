"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileText, Settings, AppWindow, MessageSquare, CornerDownLeft, Lock } from "lucide-react";
import { toast } from "../ui/Toast";
import { scrollToSection } from "@/lib/navigation";
import { useWindowStore } from "@/store/windowStore";

const SPOTLIGHT_ITEMS = [
  { title: "About Anuvab", category: "Navigation", desc: "Background, timeline, and professional bio", icon: FileText, action: "about" },
  { title: "Technical Ecosystem", category: "Navigation", desc: "Skills, frameworks, and programming languages", icon: Settings, action: "skills" },
  { title: "Featured Projects", category: "Navigation", desc: "Check out web, mobile, and embedded creations", icon: AppWindow, action: "projects" },
  { title: "Get in Touch", category: "Navigation", desc: "Contact details and message submission console", icon: FileText, action: "contact" },
  { title: "Guestbook Wall", category: "Navigation", desc: "Sign the guest wall and read thoughts from visitors", icon: MessageSquare, action: "guestbook" },
  { title: "Join Global Chat", category: "Lobby", desc: "Real-time anonymous discussions with other peers", icon: MessageSquare, action: "chat" },
  { title: "Download Resume", category: "Utility", desc: "Get Anuvab's latest PDF resume directly", icon: FileText, action: "resume" },
  { title: "Admin Portal", category: "System", desc: "Utility tools, analytics, and contact manager", icon: Settings, action: "admin" }
];

interface SpotlightSearchProps {
  isSpotlightOpen: boolean;
  setIsSpotlightOpen: (val: boolean) => void;
  isAdmin: boolean;
}

export default function SpotlightSearch({
  isSpotlightOpen,
  setIsSpotlightOpen,
  isAdmin,
}: SpotlightSearchProps) {
  const openWindow = useWindowStore((state) => state.openWindow);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchIndex, setSearchIndex] = useState(0);
  const spotlightInputRef = useRef<HTMLInputElement>(null);

  // Cmd+K or Ctrl+K shortcut for Spotlight
  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSpotlightOpen(!isSpotlightOpen);
      }
    };
    window.addEventListener("keydown", handleGlobalKeys);
    return () => window.removeEventListener("keydown", handleGlobalKeys);
  }, [isSpotlightOpen, setIsSpotlightOpen]);

  // Reset indices and autofocus input when Spotlight is opened
  useEffect(() => {
    if (isSpotlightOpen) {
      setTimeout(() => {
        setSearchQuery("");
        setSearchIndex(0);
        spotlightInputRef.current?.focus();
      }, 50);
    }
  }, [isSpotlightOpen]);

  const triggerSearchAction = (action: string) => {
    setIsSpotlightOpen(false);

    if (["about", "skills", "projects", "contact", "guestbook"].includes(action)) {
      scrollToSection(action);
      toast(`Scrolled to ${action.toUpperCase()} section`, "success");
    } else if (action === "chat") {
      openWindow("chat", "chat", "Global Chat");
    } else if (action === "resume") {
      const link = document.createElement("a");
      link.href = "/resume.pdf";
      link.download = "Anuvab_Das_Resume.pdf";
      link.click();
      toast("Downloading resume...", "success");
    } else if (action === "admin") {
      if (!isAdmin) {
        toast("Admin Portal requires authentication. Please log in first.", "error");
        return;
      }
      window.open("/admin", "_blank");
      toast("Opening Admin console...", "info");
    }
  };

  const filteredSearchItems = SPOTLIGHT_ITEMS.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchKeys = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSearchIndex((prev) => (prev + 1) % filteredSearchItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSearchIndex((prev) => (prev - 1 + filteredSearchItems.length) % filteredSearchItems.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredSearchItems[searchIndex]) {
        triggerSearchAction(filteredSearchItems[searchIndex].action);
      }
    } else if (e.key === "Escape") {
      setIsSpotlightOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {isSpotlightOpen && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-24 px-4 pointer-events-none">
          {/* Background mask */}
          <div
            onClick={() => setIsSpotlightOpen(false)}
            className="absolute inset-0 bg-black/30 backdrop-blur-[2px] pointer-events-auto"
          />

          {/* Spotlight Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative w-full max-w-xl bg-zinc-950/90 border border-white/10 rounded-2xl shadow-2xl p-3 flex flex-col pointer-events-auto backdrop-blur-2xl"
            onKeyDown={handleSearchKeys}
          >
            {/* Query Input */}
            <div className="flex items-center gap-3 px-3 py-2 border-b border-white/5">
              <Search className="w-5 h-5 text-zinc-400" />
              <input
                ref={spotlightInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchIndex(0);
                }}
                placeholder="Spotlight Search (Use arrows to navigate, Enter to select)"
                className="flex-1 bg-transparent border-none text-white focus:outline-none placeholder-zinc-500 text-sm py-1"
              />
              <div className="hidden sm:flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[10px] text-zinc-400 select-none">
                ESC
              </div>
            </div>

            {/* Search Results List */}
            <div className="mt-2 max-h-80 overflow-y-auto scrollbar-thin">
              {filteredSearchItems.length === 0 ? (
                <div className="text-center py-8 text-xs text-zinc-500 font-medium">
                  No results found for &quot;{searchQuery}&quot;
                </div>
              ) : (
                filteredSearchItems.map((item, idx) => {
                  const isSelected = idx === searchIndex;
                  const IconComponent = item.icon;
                  const isDisabledAdmin = item.action === "admin" && !isAdmin;

                  return (
                    <div
                      key={item.title}
                      onClick={() => {
                        if (isDisabledAdmin) {
                          toast("Admin Portal requires authentication. Please log in first.", "error");
                          return;
                        }
                        triggerSearchAction(item.action);
                      }}
                      onMouseEnter={() => {
                        if (!isDisabledAdmin) {
                          setSearchIndex(idx);
                        }
                      }}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${isDisabledAdmin
                          ? isSelected
                            ? "bg-zinc-800/50 text-zinc-500 opacity-60 cursor-not-allowed"
                            : "opacity-40 cursor-not-allowed text-zinc-500"
                          : isSelected
                            ? "bg-emerald-500 text-white"
                            : "hover:bg-white/5 text-zinc-300"
                        }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2 rounded-lg ${isDisabledAdmin
                            ? isSelected ? "bg-white/10 text-zinc-500" : "bg-white/5 text-zinc-600"
                            : isSelected ? "bg-white/20 text-white" : "bg-white/5 text-zinc-400"
                          } shrink-0`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-semibold">{item.title}</p>
                          <p className={`text-[10px] mt-0.5 truncate ${isDisabledAdmin
                              ? "text-zinc-600"
                              : isSelected ? "text-white/80" : "text-zinc-500"
                            }`}>
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isDisabledAdmin ? (
                          <span className="flex items-center gap-1 text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-red-950/30 border border-red-900/30 text-red-400 font-sans">
                            <Lock className="w-2.5 h-2.5" /> Locked
                          </span>
                        ) : (
                          <span className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${isSelected ? "bg-white/25 text-white" : "bg-white/5 text-zinc-500"
                            }`}>
                            {item.category}
                          </span>
                        )}
                        {isSelected && !isDisabledAdmin && (
                          <CornerDownLeft className="w-3.5 h-3.5 opacity-80" />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
