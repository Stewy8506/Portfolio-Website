"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal as TerminalIcon, X, Maximize2, Minus } from "lucide-react";
import { useSoundEffect } from "@/hooks/useSoundEffect";
import { scrollToSection } from "@/lib/navigation";
import { toast } from "./Toast";

interface CommandOutput {
  id: string;
  type: "input" | "output" | "error";
  content: React.ReactNode;
}

export default function TerminalWindow() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      id: "intro",
      type: "output",
      content: (
        <div className="text-emerald-400 mb-2">
          <p>anv-os v1.0.0 (tty1)</p>
          <p>Type &apos;help&apos; to see available commands.</p>
        </div>
      ),
    },
  ]);
  const [isMaximized, setIsMaximized] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { playThocc } = useSoundEffect();

  // Listen for hotkeys and custom events
  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      if (window.innerWidth < 768) return; // Disable on mobile/phone screens
      if ((e.metaKey || e.ctrlKey) && e.key === "q") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    const handleToggleEvent = () => {
      if (window.innerWidth < 768) return; // Disable on mobile/phone screens
      setIsOpen(prev => !prev);
    };

    window.addEventListener("keydown", handleGlobalKeys);
    window.addEventListener("toggleTerminal", handleToggleEvent);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeys);
      window.removeEventListener("toggleTerminal", handleToggleEvent);
    };
  }, [isOpen]);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    playThocc();

    const newHistory: CommandOutput[] = [
      ...history,
      { id: Date.now().toString() + "in", type: "input", content: trimmed },
    ];

    let output: React.ReactNode = null;
    let type: "output" | "error" = "output";

    switch (trimmed.toLowerCase()) {
      case "help":
        output = (
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1 my-2">
            <li><span className="text-emerald-300">about</span> - Who am I?</li>
            <li><span className="text-emerald-300">projects</span> - View my work</li>
            <li><span className="text-emerald-300">resume</span> - Download PDF</li>
            <li><span className="text-emerald-300">contact</span> - Get in touch</li>
            <li><span className="text-emerald-300">clear</span> - Clear terminal</li>
            <li><span className="text-emerald-300">exit</span> - Close terminal</li>
            <li><span className="text-emerald-300">sudo</span> - ???</li>
          </ul>
        );
        break;
      case "about":
        output = "Navigating to About section...";
        scrollToSection("about");
        setTimeout(() => setIsOpen(false), 800);
        break;
      case "projects":
      case "ls projects":
      case "ls":
        output = "Navigating to Projects section...";
        scrollToSection("projects");
        setTimeout(() => setIsOpen(false), 800);
        break;
      case "contact":
        output = "Navigating to Contact section...";
        scrollToSection("contact");
        setTimeout(() => setIsOpen(false), 800);
        break;
      case "resume":
      case "cat resume.pdf":
        output = "Downloading resume...";
        const link = document.createElement("a");
        link.href = "/resume.pdf";
        link.download = "Anuvab_Resume.pdf";
        link.click();
        break;
      case "clear":
        setHistory([]);
        setInput("");
        return;
      case "exit":
        setIsOpen(false);
        setInput("");
        return;
      case "sudo rm -rf /":
        output = "Nice try. Permission denied.";
        type = "error";
        toast("Unauthorized access attempt logged.", "error");
        break;
      case "whoami":
        output = "guest_user";
        break;
      case "pwd":
        output = "/home/guest";
        break;
      case "date":
        output = new Date().toString();
        break;
      default:
        if (trimmed.startsWith("sudo ")) {
          output = `${trimmed}: user is not in the sudoers file. This incident will be reported.`;
          type = "error";
        } else {
          output = `bash: ${trimmed}: command not found`;
          type = "error";
        }
    }

    newHistory.push({ id: Date.now().toString() + "out", type, content: output });
    setHistory(newHistory);
    setInput("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm pointer-events-auto">
          {/* CRT Screen Filter */}
          <style dangerouslySetInnerHTML={{
            __html: `
            @keyframes flicker {
              0% { opacity: 0.95; }
              5% { opacity: 0.85; }
              10% { opacity: 0.95; }
              100% { opacity: 1; }
            }
            .crt::before {
              content: " ";
              display: block;
              position: absolute;
              top: 0; left: 0; bottom: 0; right: 0;
              background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
              z-index: 2;
              background-size: 100% 2px, 3px 100%;
              pointer-events: none;
            }
          `}} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              width: isMaximized ? "100%" : "100%",
              height: isMaximized ? "100%" : "auto"
            }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`crt relative bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col font-mono max-w-3xl ${isMaximized ? 'h-full max-w-none rounded-none' : 'min-h-[400px] max-h-[80vh]'}`}
            onClick={() => inputRef.current?.focus()}
          >
            {/* Title Bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800 select-none">
              <div className="flex items-center gap-2">
                <TerminalIcon className="w-4 h-4 text-zinc-400" />
                <span className="text-xs font-semibold text-zinc-400 tracking-wider">guest@anv-os:~</span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={(e) => { e.stopPropagation(); setIsMaximized(false); setIsOpen(false); }} className="text-zinc-500 hover:text-white transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); setIsMaximized(!isMaximized); }} className="text-zinc-500 hover:text-white transition-colors hidden sm:block">
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="text-zinc-500 hover:text-red-400 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Terminal Body */}
            <div
              ref={scrollRef}
              className="flex-1 p-4 overflow-y-auto text-sm text-emerald-500/90 leading-relaxed custom-scrollbar"
              style={{ textShadow: "0 0 5px rgba(6, 182, 212, 0.4)" }}
            >
              {history.map((entry) => (
                <div key={entry.id} className="mb-1">
                  {entry.type === "input" ? (
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">guest@anv-os:~$</span>
                      <span className="text-emerald-100">{entry.content}</span>
                    </div>
                  ) : (
                    <div className={entry.type === "error" ? "text-red-400" : "text-emerald-400"}>
                      {entry.content}
                    </div>
                  )}
                </div>
              ))}

              {/* Active Input Line */}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-emerald-500 font-bold shrink-0">guest@anv-os:~$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCommand(input);
                    if (e.key === "c" && e.ctrlKey) { e.preventDefault(); setInput(""); }
                  }}
                  className="flex-1 bg-transparent border-none text-emerald-100 outline-none w-full"
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
