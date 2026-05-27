"use client";

import React, { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { User, Code2, FolderGit2, Mail, Terminal, MessageSquare } from "lucide-react";
import { useSoundEffect } from "@/hooks/useSoundEffect";
import { usePathname } from "next/navigation";
import Magnetic from "@/components/ui/Magnetic";
import { scrollToSection } from "@/lib/navigation";
import { useWindowStore, WindowType } from "@/store/windowStore";

export default function Dock() {
  const pathname = usePathname();
  const { playThocc } = useSoundEffect();
  const { scrollY } = useScroll();
  const [isHidden, setIsHidden] = useState(false);

  const { windows, activeWindowId, openWindow, focusWindow, minimizeWindow } = useWindowStore();

  // Auto-hide the dock on scroll down, show on scroll up
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setIsHidden(true); // Scrolling down, hide
    } else {
      setIsHidden(false); // Scrolling up, reveal
    }
  });

  if (pathname === "/projects" || pathname.startsWith("/admin")) return null;

  // 1. Permanent Pinned Items (Core Sections)
  const pinnedItems = [
    { 
      name: "About", 
      icon: User, 
      type: "link" as const,
      href: "#about", 
      color: "from-blue-400 to-blue-600" 
    },
    { 
      name: "Skills", 
      icon: Code2, 
      type: "link" as const,
      href: "#skills", 
      color: "from-emerald-400 to-emerald-600" 
    },
    { 
      name: "Projects", 
      icon: FolderGit2, 
      type: "link" as const,
      href: "#projects", 
      color: "from-violet-400 to-violet-600" 
    },
    { 
      name: "Contact", 
      icon: Mail, 
      type: "link" as const,
      href: "#contact", 
      color: "from-amber-400 to-amber-600" 
    }
  ];

  // 2. Dynamic Running Apps (Only show in Dock if running/open)
  const activeApps = [];

  if (windows["terminal"]?.isOpen) {
    activeApps.push({
      name: "Terminal",
      icon: Terminal,
      type: "app" as const,
      id: "terminal",
      appType: "terminal" as WindowType,
      title: "Terminal (bash)",
      color: "from-zinc-800 to-zinc-950 border border-white/5 shadow-inner"
    });
  }

  if (windows["chat"]?.isOpen) {
    activeApps.push({
      name: "Chat Lobby",
      icon: MessageSquare,
      type: "app" as const,
      id: "chat",
      appType: "chat" as WindowType,
      title: "Global Chat",
      color: "from-emerald-500/80 to-emerald-700/80 border border-white/5 shadow-inner"
    });
  }

  const handleItemClick = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    playThocc();
    
    if (item.type === "link") {
      scrollToSection(item.href.slice(1));
    } else {
      const win = windows[item.id];
      if (!win || !win.isOpen) {
        openWindow(item.id, item.appType, item.title);
      } else if (win.isMinimized || activeWindowId !== item.id) {
        focusWindow(item.id);
      } else {
        minimizeWindow(item.id);
      }
    }
  };

  const isWindowOpen = (id: string) => {
    return !!windows[id]?.isOpen;
  };

  return (
    <motion.div 
      initial="hidden"
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: 110, opacity: 0 }
      }}
      animate={isHidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="fixed bottom-6 inset-x-0 z-50 flex justify-center pointer-events-none px-4"
    >
      
      {/* Desktop macOS Dock */}
      <div className="hidden md:flex glass-effect rounded-2xl border border-white/10 p-3 items-center gap-4 shadow-2xl pointer-events-auto bg-zinc-900/60 backdrop-blur-2xl transition-all duration-300">
        
        {/* Render Pinned Items */}
        {pinnedItems.map((item) => (
          <Magnetic key={item.name} strength={0.4}>
            <a
              href={item.href}
              onClick={(event) => handleItemClick(event, item)}
              onMouseEnter={playThocc}
              data-cursor="none"
              className="group relative flex items-center justify-center"
            >
              {/* Tooltip */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-zinc-800/95 backdrop-blur-md text-white text-xs font-medium rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
                {item.name}
              </div>
              
              <motion.div 
                whileHover={{ scale: 1.35, y: -10 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg border border-white/20 relative z-10 hover:z-20`}
              >
                <item.icon className="w-6 h-6 text-white drop-shadow-md" />
              </motion.div>
              
              {/* Active Indicator dot */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-white/50 scale-75 group-hover:scale-100 transition-all duration-300" />
            </a>
          </Magnetic>
        ))}

        {/* Vertical Divider (only visible if there are running apps) */}
        {activeApps.length > 0 && (
          <div className="w-[1px] h-8 bg-white/25 mx-1 self-center rounded-full transition-all duration-300" />
        )}

        {/* Render Running Apps */}
        {activeApps.map((item) => (
          <Magnetic key={item.name} strength={0.4}>
            <a
              href="#"
              onClick={(event) => handleItemClick(event, item)}
              onMouseEnter={playThocc}
              data-cursor="none"
              className="group relative flex items-center justify-center"
            >
              {/* Tooltip */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-zinc-800/95 backdrop-blur-md text-white text-xs font-medium rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
                {item.name}
              </div>
              
              <motion.div 
                whileHover={{ scale: 1.35, y: -10 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg border border-white/20 relative z-10 hover:z-20`}
              >
                <item.icon className="w-6 h-6 text-white drop-shadow-md" />
              </motion.div>
              
              {/* Active Pulse Glowing Dot */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400 scale-100 shadow-[0_0_8px_rgba(52,211,153,0.5)] transition-all duration-300" />
            </a>
          </Magnetic>
        ))}
      </div>

      {/* Mobile iOS Tab Bar */}
      <div className="flex md:hidden glass-effect rounded-full border border-white/10 py-2.5 px-6 items-center justify-between w-full max-w-sm shadow-2xl pointer-events-auto bg-zinc-900/80 backdrop-blur-2xl transition-all duration-300">
        
        {/* Render Pinned Items */}
        {pinnedItems.map((item) => (
          <a 
            key={item.name} 
            href={item.href} 
            onClick={(event) => handleItemClick(event, item)}
            onMouseEnter={playThocc}
            data-cursor="none" 
            className="flex flex-col items-center justify-center gap-0.5 opacity-70 hover:opacity-100 active:scale-95 transition-all"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center">
              <item.icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] font-medium text-white/80">{item.name}</span>
          </a>
        ))}

        {/* Divider for mobile running apps */}
        {activeApps.length > 0 && (
          <div className="w-[1px] h-6 bg-white/20 mx-1 self-center rounded-full" />
        )}

        {/* Render Running Apps */}
        {activeApps.map((item) => (
          <a 
            key={item.name} 
            href="#" 
            onClick={(event) => handleItemClick(event, item)}
            onMouseEnter={playThocc}
            data-cursor="none" 
            className="flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-all relative group"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center relative">
              <item.icon className="w-5 h-5 text-emerald-400" />
              <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-emerald-400 shadow-md" />
            </div>
            <span className="text-[10px] font-semibold text-emerald-400">{item.name}</span>
          </a>
        ))}
      </div>

    </motion.div>
  );
}
