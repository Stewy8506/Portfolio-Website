"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Command, Wifi, BatteryMedium, Search, MessageSquare, CornerDownLeft, FileText, Settings, AppWindow, Volume2, VolumeX, Lock, Terminal } from "lucide-react";
import MenuDropdown, { MenuItem } from "../ui/MenuDropdown";
import ToastContainer, { toast } from "../ui/Toast";
import ChatWindow from "../ui/ChatWindow";
import { usePathname } from "next/navigation";
import { useSoundEffect } from "@/hooks/useSoundEffect";
import Magnetic from "../ui/Magnetic";
import { scrollToSection } from "@/lib/navigation";

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

export default function MenuBar() {
  const pathname = usePathname();
  const [time, setTime] = useState("");
  const [is24Hour, setIs24Hour] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchIndex, setSearchIndex] = useState(0);

  const menuRef = useRef<HTMLDivElement>(null);
  const spotlightInputRef = useRef<HTMLInputElement>(null);

  // Check auth status for Admin Portal
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check");
        if (res.ok) {
          const data = await res.json();
          setIsAdmin(!!data.authenticated);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        setIsAdmin(false);
      }
    };

    checkAuth();
  }, [isSpotlightOpen]);

  // Lofi Audio Stream state and ref (YouTube Player API backend)
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5); // Default to 50%
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { playThocc } = useSoundEffect();

  // Initialize YouTube Iframe Player on mount (client-side only)
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Create a hidden element for YouTube player
    let div = document.getElementById("youtube-lofi-player");
    if (!div) {
      div = document.createElement("div");
      div.id = "youtube-lofi-player";
      (div as HTMLElement).style.display = "none";
      (div as HTMLElement).style.position = "absolute";
      (div as HTMLElement).style.width = "0px";
      (div as HTMLElement).style.height = "0px";
      (div as HTMLElement).style.opacity = "0";
      (div as HTMLElement).style.pointerEvents = "none";
      document.body.appendChild(div);
    }

    // 2. Load YouTube Iframe API script if not present
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(window as any).YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // Define or override global callback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).onYouTubeIframeAPIReady = () => {
      initPlayer();
    };

    const initPlayer = () => {
      try {
        if (playerRef.current) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        playerRef.current = new (window as any).YT.Player("youtube-lofi-player", {
          height: "0",
          width: "0",
          videoId: "CFGLoQIhmow", // Yasumu - We Met (requested soothing track)
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            loop: 1,
            playlist: "CFGLoQIhmow",
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
          },
          events: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onReady: (event: any) => {
              event.target.setVolume(volume * 100);
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onStateChange: (event: any) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              if (event.data === (window as any).YT.PlayerState.ENDED) {
                event.target.playVideo();
              }
            }
          },
        });
      } catch (e) {
        console.error("YouTube Player initialization failed", e);
      }
    };

    // If script is already loaded by other sessions, initialize immediately
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).YT && (window as any).YT.Player) {
      initPlayer();
    }

    return () => {
      // Cleanup player
      if (playerRef.current && typeof playerRef.current.destroy === "function") {
        try {
          playerRef.current.destroy();
        } catch { }
        playerRef.current = null;
      }
      const existingDiv = document.getElementById("youtube-lofi-player");
      if (existingDiv) {
        existingDiv.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volume]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (playerRef.current && typeof playerRef.current.setVolume === "function") {
      playerRef.current.setVolume(val * 100);
    }
  };

  const toggleMusic = () => {
    if (!playerRef.current || typeof playerRef.current.playVideo !== "function") {
      toast("Player is loading... please try again in a moment.", "info");
      return;
    }

    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
        toast("Soothing Stream Paused", "info");
      } else {
        playerRef.current.setVolume(volume * 100);
        playerRef.current.playVideo();
        setIsPlaying(true);
        toast("Playing: Lofi Music 🎧", "success");
      }
    } catch (e) {
      console.error("Playback toggle failed", e);
      toast("Playback blocked. Please interact with the page first.", "error");
    }
  };

  // Time & date cycle
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: !is24Hour,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [is24Hour]);

  // Click outside menu handling
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  // Cmd+K or Ctrl+K shortcut for Spotlight
  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSpotlightOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleGlobalKeys);
    return () => window.removeEventListener("keydown", handleGlobalKeys);
  }, []);

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

  const handleMenuHover = (menu: string) => {
    if (activeMenu) {
      setActiveMenu(menu);
    }
  };

  const handleMenuClick = (menu: string) => {
    if (activeMenu === menu) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menu);
    }
  };

  // WiFi Action
  const handleWifiClick = () => {
    const isOnline = typeof navigator !== "undefined" ? navigator.onLine : true;
    if (isOnline) {
      toast("Wi-Fi Connected: 'anv-os-secure' (Signal strength: Strong, 150 Mbps)", "success");
    } else {
      toast("Wi-Fi Disconnected: No active adapters detected.", "error");
    }
  };

  // Battery Action
  const handleBatteryClick = async () => {
    if (typeof navigator !== "undefined" && "getBattery" in navigator) {
      try {
        const battery: unknown = await (navigator as unknown as { getBattery: () => Promise<unknown> }).getBattery();
        const navBattery = battery as { level: number; charging: boolean; chargingTime: number; dischargingTime: number };
        const levelPct = Math.round(navBattery.level * 100);
        const state = navBattery.charging ? "Charging ⚡" : "Discharging 🔋";
        const remain = navBattery.chargingTime === Infinity || navBattery.dischargingTime === Infinity
          ? "Adapter Connected"
          : `${Math.round(navBattery.charging ? navBattery.chargingTime / 60 : navBattery.dischargingTime / 60)} mins remaining`;
        toast(`Battery Level: ${levelPct}% (${state} - ${remain})`, "info");
      } catch {
        toast("Battery Level: 100% (AC Power Line Connected)", "info");
      }
    } else {
      toast("Battery Level: 100% (AC Power Line Connected)", "info");
    }
  };

  // Clock format and full date action
  const handleClockClick = () => {
    setIs24Hour((prev) => !prev);
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    toast(`System Date: ${dateStr} (Switched format)`, "success");
  };

  // Spotlight Action Trigger
  const triggerSearchAction = (action: string) => {
    setIsSpotlightOpen(false);

    if (["about", "skills", "projects", "contact", "guestbook"].includes(action)) {
      scrollToSection(action);
      toast(`Scrolled to ${action.toUpperCase()} section`, "success");
    } else if (action === "chat") {
      setIsChatOpen(true);
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

  // Filter items in Spotlight Search
  const filteredSearchItems = SPOTLIGHT_ITEMS.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle keys inside Spotlight Search modal
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

  const menuData: Record<string, MenuItem[]> = {
    anvos: [
      { label: "About anv os", action: () => { setActiveMenu(null); scrollToSection("about") } },
      { label: "Sign Guestbook", action: () => { setActiveMenu(null); scrollToSection("guestbook") } },
      { divider: true, label: "" },
      { label: "System Preferences...", disabled: true },
      { label: "App Store...", disabled: true },
      { divider: true, label: "" },
      { label: "Restart", action: () => { window.location.reload(); } },
      { label: "Shut Down", disabled: true },
    ],
    File: [
      { label: "New Window", shortcut: "⌘N", action: () => { window.open(window.location.href, "_blank"); setActiveMenu(null); } },
      { divider: true, label: "" },
      {
        label: "Download Resume", shortcut: "⌘D", action: () => {
          triggerSearchAction("resume");
          setActiveMenu(null);
        }
      },
      { divider: true, label: "" },
      { label: "Print...", shortcut: "⌘P", action: () => { window.print(); setActiveMenu(null); } },
      { label: "Close Window", shortcut: "⌘W", action: () => { toast("Cannot close main window.", "info"); setActiveMenu(null); } },
    ],
    Edit: [
      { label: "Undo", shortcut: "⌘Z", action: () => { toast("Undo", "info"); setActiveMenu(null); } },
      { label: "Redo", shortcut: "⇧⌘Z", action: () => { toast("Redo", "info"); setActiveMenu(null); } },
      { divider: true, label: "" },
      { label: "Cut", shortcut: "⌘X", action: () => { toast("Cut", "info"); setActiveMenu(null); } },
      { label: "Copy", shortcut: "⌘C", action: () => { toast("Copy", "info"); setActiveMenu(null); } },
      { label: "Paste", shortcut: "⌘V", action: () => { toast("Paste", "info"); setActiveMenu(null); } },
      { label: "Select All", shortcut: "⌘A", action: () => { toast("Select All", "info"); setActiveMenu(null); } },
    ],
    View: [
      { label: "Reload", shortcut: "⌘R", action: () => { window.location.reload(); } },
      {
        label: "Toggle Fullscreen", shortcut: "⌃⌘F", action: () => {
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
          } else {
            document.exitFullscreen();
          }
          setActiveMenu(null);
        }
      },
      { divider: true, label: "" },
      { label: "View Source", shortcut: "⌥⌘U", action: () => { window.open("https://github.com/Stewy8506/portfolio-app", "_blank"); setActiveMenu(null); } },
    ],
    Window: [
      { label: "Minimize", shortcut: "⌘M", action: () => { toast("Window Minimized", "info"); setActiveMenu(null); } },
      { label: "Zoom", action: () => { toast("Window Zoomed", "info"); setActiveMenu(null); } },
      { divider: true, label: "" },
      { label: "Bring All to Front", action: () => { toast("Brought to front", "info"); setActiveMenu(null); } },
    ],
    Help: [
      { label: "anv os Help", action: () => { toast("You are looking at it!", "success"); setActiveMenu(null); } },
      { label: "Contact Support", action: () => { scrollToSection("contact"); setActiveMenu(null); } }
    ]
  };

  if (pathname === "/projects" || pathname.startsWith("/admin")) return null;

  return (
    <>
      <ToastContainer />
      <motion.div
        ref={menuRef}
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="fixed top-0 inset-x-0 h-10 md:h-7 z-50 flex items-center justify-between px-6 md:px-4 bg-transparent md:bg-zinc-900/60 md:backdrop-blur-xl border-b-0 md:border-b border-white/10 text-[14px] md:text-[13px] font-medium text-white/90 select-none shadow-sm"
      >
        {/* Desktop Left side */}
        <div className="hidden md:flex items-center gap-5">
          <div className="relative" id="tour-anvos">
            <div
              onClick={() => handleMenuClick("anvos")}
              onMouseEnter={() => handleMenuHover("anvos")}
              className={`flex items-center gap-2 px-2 py-0.5 rounded cursor-pointer transition-colors ${activeMenu === "anvos" ? "bg-white/20" : "hover:bg-white/10"}`}
            >
              <Command className="w-3.5 h-3.5" />
              <span className="font-bold tracking-tight">anv os</span>
            </div>
            <MenuDropdown isOpen={activeMenu === "anvos"} items={menuData["anvos"]} />
          </div>

          <div className="hidden md:flex items-center gap-1 text-white/80">
            {["File", "Edit", "View", "Window", "Help"].map((menu) => (
              <div key={menu} className="relative">
                <div
                  onClick={() => handleMenuClick(menu)}
                  onMouseEnter={() => handleMenuHover(menu)}
                  className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${activeMenu === menu ? "bg-white/20 text-white" : "hover:bg-white/10 hover:text-white"}`}
                >
                  {menu}
                </div>
                <MenuDropdown isOpen={activeMenu === menu} items={menuData[menu]} />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Left side (iOS Time) */}
        <div className="flex md:hidden items-center">
          <span className="font-semibold cursor-pointer" onClick={handleClockClick}>
            {time ? time.split(" ")[0] : "10:00"}
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4 md:text-white/80">
          <div className="flex items-center gap-2 md:gap-3">
            {/* 🎵 Lofi Music Stream Control (Hover to expand volume slider) */}
            <div id="tour-lofi" className="group flex items-center gap-1.5 px-1.5 py-0.5 rounded-lg hover:bg-white/5 transition-all duration-300">
              <button
                onClick={toggleMusic}
                className="flex items-center justify-center p-0.5 rounded active:scale-95 transition-all text-white/90 cursor-pointer outline-none border-0 bg-transparent"
                title={isPlaying ? "Pause Lofi Stream" : "Stream Soothing Lofi"}
              >
                {isPlaying ? (
                  <Volume2 className="w-4 h-4 md:w-3.5 md:h-3.5 text-sky-400 animate-pulse" />
                ) : (
                  <VolumeX className="w-4 h-4 md:w-3.5 md:h-3.5 text-zinc-400 hover:text-white" />
                )}
              </button>

              {/* Slide-out Volume Slider */}
              <div className="w-0 opacity-0 pointer-events-none group-hover:w-16 group-hover:opacity-100 group-hover:pointer-events-auto flex items-center transition-all duration-300 ease-out overflow-hidden">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-14 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-sky-400 focus:outline-none"
                  style={{
                    WebkitAppearance: "none",
                    outline: "none",
                  }}
                  title={`Volume: ${Math.round(volume * 100)}%`}
                />
              </div>
            </div>



            {/* 💬 Global Chat Trigger */}
            <Magnetic strength={0.4}>
              <button
                id="tour-chat"
                onClick={() => setIsChatOpen(true)}
                className="flex items-center justify-center p-1 rounded hover:bg-white/10 active:scale-95 transition-all text-white/90 cursor-pointer outline-none border-0 bg-transparent"
                title="Open Global Chat"
              >
                <MessageSquare className="w-4 h-4 md:w-3.5 md:h-3.5 text-emerald-400" />
              </button>
            </Magnetic>

            {/* 📶 WiFi Diagnostic */}
            <Magnetic strength={0.4}>
              <button
                onClick={handleWifiClick}
                className="flex items-center justify-center p-1 rounded hover:bg-white/10 active:scale-95 transition-all text-white/90 cursor-pointer outline-none border-0 bg-transparent"
                title="WiFi Status"
              >
                <Wifi className="w-4 h-4 md:w-3.5 md:h-3.5 text-zinc-300 hover:text-white" />
              </button>
            </Magnetic>

            {/* 🔍 Search / Spotlight Trigger */}
            <Magnetic strength={0.4}>
              <button
                id="tour-spotlight"
                onClick={() => setIsSpotlightOpen(true)}
                className="flex items-center justify-center p-1 rounded hover:bg-white/10 active:scale-95 transition-all text-white/90 cursor-pointer outline-none border-0 bg-transparent"
                title="Spotlight Search (Cmd+K)"
              >
                <Search className="w-4 h-4 md:w-3.5 md:h-3.5 text-zinc-300 hover:text-white" />
              </button>
            </Magnetic>

            {/* 💻 Terminal Trigger */}
            <Magnetic strength={0.4}>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('toggleTerminal'))}
                className="hidden md:flex items-center justify-center p-1 rounded hover:bg-white/10 active:scale-95 transition-all text-white/90 cursor-pointer outline-none border-0 bg-transparent"
                title="Open Terminal (Cmd+Q)"
              >
                <Terminal className="w-4 h-4 md:w-3.5 md:h-3.5 text-emerald-400 hover:text-white" />
              </button>
            </Magnetic>

            {/* 🔋 Battery Diagnostic */}
            <Magnetic strength={0.4}>
              <button
                onClick={handleBatteryClick}
                className="flex items-center justify-center p-1 rounded hover:bg-white/10 active:scale-95 transition-all text-white/90 cursor-pointer outline-none border-0 bg-transparent"
                title="Power & Battery Status"
              >
                <BatteryMedium className="w-5 h-5 md:w-4 md:h-4 text-zinc-300 hover:text-white" />
              </button>
            </Magnetic>
          </div>

          {/* ⏰ Clock Trigger */}
          <span
            className="hidden md:block text-white/90 cursor-pointer hover:text-white active:scale-95 transition-transform"
            onClick={handleClockClick}
            title="Toggle 24-hour clock / Show Date"
          >
            {time || "10:00 AM"}
          </span>
        </div>
      </motion.div>

      {/* Render Global Chat Widget */}
      <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* 🔍 SPOTLIGHT SEARCH OVERLAY */}
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
    </>
  );
}
